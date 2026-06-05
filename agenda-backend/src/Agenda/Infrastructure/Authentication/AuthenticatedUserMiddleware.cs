using Agenda.Modules.Users.Application.Abstractions;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Agenda.Infrastructure.Authentication;

public sealed class AuthenticatedUserMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IUserRepository users, AuthenticatedUserContext authenticatedUser)
    {
        var endpoint = context.GetEndpoint();
        var allowAnonymous = endpoint?.Metadata.GetMetadata<IAllowAnonymous>() is not null;
        var requiresAuthorization = endpoint?.Metadata.GetOrderedMetadata<IAuthorizeData>().Any() is true;

        if (!requiresAuthorization || allowAnonymous)
        {
            await next(context);
            return;
        }

        if (context.User.Identity?.IsAuthenticated != true)
        {
            await next(context);
            return;
        }

        var rawUserId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? context.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? context.User.FindFirstValue("sub");

        if (!Guid.TryParse(rawUserId, out var userId))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new { error = "Token does not identify a valid user.", code = "auth.invalid_token" });
            return;
        }

        if (!await users.ExistsByIdAsync(userId, context.RequestAborted))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new { error = "Authenticated user was not found.", code = "auth.user_not_found" });
            return;
        }

        authenticatedUser.SetUserId(userId);
        await next(context);
    }
}

public static class AuthenticatedUserMiddlewareExtensions
{
    public static IApplicationBuilder UseAuthenticatedUser(this IApplicationBuilder app) =>
        app.UseMiddleware<AuthenticatedUserMiddleware>();
}
