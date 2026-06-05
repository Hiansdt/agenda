using Agenda.Infrastructure.Authentication;
using Agenda.Modules.Users.Application.Abstractions;
using Agenda.Modules.Users.Application.UseCases.GetCurrentUser;
using Agenda.Modules.Users.Application.UseCases.LoginUser;
using Agenda.Modules.Users.Application.UseCases.RegisterUser;
using Agenda.Modules.Users.Infrastructure;
using Agenda.Shared;

namespace Agenda.Modules.Users;

public static class UsersModule
{
    public static IServiceCollection AddUsersModule(this IServiceCollection services)
    {
        services.AddScoped<AuthenticatedUserContext>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<RegisterUserUseCase>();
        services.AddScoped<LoginUserUseCase>();
        services.AddScoped<GetCurrentUserUseCase>();

        return services;
    }

    public static IEndpointRouteBuilder MapUsersModule(this IEndpointRouteBuilder app)
    {
        app.MapPost("/users", RegisterAsync);
        app.MapPost("/users/login", LoginAsync);
        app.MapPost("/users/logout", Logout);
        app.MapGet("/users/me", GetCurrentUserAsync).RequireAuthorization();

        return app;
    }

    private static async Task<IResult> RegisterAsync(
        RegisterUserRequest request,
        RegisterUserUseCase useCase,
        CancellationToken cancellationToken)
    {
        var result = await useCase.ExecuteAsync(new RegisterUserInput(request.Name, request.Email, request.Password), cancellationToken);
        return result.IsSuccess
            ? Results.Created($"/users/{result.Value!.Id}", result.Value)
            : EndpointResultMapper.Failure(result.Error);
    }

    private static async Task<IResult> LoginAsync(
        LoginUserRequest request,
        LoginUserUseCase useCase,
        IConfiguration configuration,
        IWebHostEnvironment environment,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        var result = await useCase.ExecuteAsync(new LoginUserInput(request.Email, request.Password), cancellationToken);
        if (result.IsFailure)
        {
            return EndpointResultMapper.Failure(result.Error);
        }

        var expiresInMinutes = int.TryParse(configuration["Jwt:ExpiresInMinutes"], out var value) ? value : 60;
        context.Response.Cookies.Append(AuthConstants.SessionCookieName, result.Value!.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = !environment.IsDevelopment(),
            SameSite = environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddMinutes(expiresInMinutes),
            Path = "/"
        });

        return Results.Ok(new { success = true });
    }

    private static IResult Logout(HttpContext context)
    {
        context.Response.Cookies.Delete(AuthConstants.SessionCookieName, new CookieOptions
        {
            HttpOnly = true,
            Path = "/"
        });

        return Results.Ok(new { success = true });
    }

    private static async Task<IResult> GetCurrentUserAsync(
        AuthenticatedUserContext authenticatedUser,
        GetCurrentUserUseCase useCase,
        CancellationToken cancellationToken)
    {
        var result = await useCase.ExecuteAsync(authenticatedUser.UserId, cancellationToken);
        return result.IsSuccess
            ? Results.Ok(result.Value)
            : EndpointResultMapper.Failure(result.Error);
    }

    public sealed record RegisterUserRequest(string Name, string Email, string Password);
    public sealed record LoginUserRequest(string Email, string Password);
}
