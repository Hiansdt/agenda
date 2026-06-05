using Agenda.Infrastructure.Authentication;
using Agenda.Modules.Contacts.Application.Abstractions;
using Agenda.Modules.Contacts.Application.UseCases.AddContact;
using Agenda.Modules.Contacts.Application.UseCases.DeleteContact;
using Agenda.Modules.Contacts.Application.UseCases.EditContact;
using Agenda.Modules.Contacts.Application.UseCases.ListContacts;
using Agenda.Modules.Contacts.Infrastructure;
using Agenda.Shared;

namespace Agenda.Modules.Contacts;

public static class ContactsModule
{
    public static IServiceCollection AddContactsModule(this IServiceCollection services)
    {
        services.AddScoped<IContactRepository, ContactRepository>();
        services.AddScoped<ListContactsUseCase>();
        services.AddScoped<AddContactUseCase>();
        services.AddScoped<EditContactUseCase>();
        services.AddScoped<DeleteContactUseCase>();

        return services;
    }

    public static IEndpointRouteBuilder MapContactsModule(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/contacts").RequireAuthorization();

        group.MapGet("/", ListAsync);
        group.MapPost("/", AddAsync);
        group.MapPatch("/{id:guid}", EditAsync);
        group.MapDelete("/{id:guid}", DeleteAsync);

        return app;
    }

    private static async Task<IResult> ListAsync(
        HttpContext httpContext,
        AuthenticatedUserContext authenticatedUser,
        ListContactsUseCase useCase,
        CancellationToken cancellationToken)
    {
        var page = ParsePositiveInt(httpContext.Request.Query["page"], 1);
        var pageSize = ParsePositiveInt(httpContext.Request.Query["page_size"], 10);
        var search = httpContext.Request.Query["search"].ToString();

        var result = await useCase.ExecuteAsync(new ListContactsInput(authenticatedUser.UserId, page, pageSize, search), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : EndpointResultMapper.Failure(result.Error);
    }

    private static async Task<IResult> AddAsync(
        AuthenticatedUserContext authenticatedUser,
        AddContactUseCase useCase,
        ContactRequest request,
        CancellationToken cancellationToken)
    {
        var result = await useCase.ExecuteAsync(
            new AddContactInput(authenticatedUser.UserId, request.Name, request.Phone, request.Email, request.Address, request.Observations),
            cancellationToken);

        return result.IsSuccess
            ? Results.Created($"/contacts/{result.Value!.Id}", result.Value)
            : EndpointResultMapper.Failure(result.Error);
    }

    private static async Task<IResult> EditAsync(
        Guid id,
        AuthenticatedUserContext authenticatedUser,
        EditContactUseCase useCase,
        ContactRequest request,
        CancellationToken cancellationToken)
    {
        var result = await useCase.ExecuteAsync(
            new EditContactInput(authenticatedUser.UserId, id, request.Name, request.Phone, request.Email, request.Address, request.Observations),
            cancellationToken);

        return result.IsSuccess ? Results.Ok(result.Value) : EndpointResultMapper.Failure(result.Error);
    }

    private static async Task<IResult> DeleteAsync(
        Guid id,
        AuthenticatedUserContext authenticatedUser,
        DeleteContactUseCase useCase,
        CancellationToken cancellationToken)
    {
        var result = await useCase.ExecuteAsync(new DeleteContactInput(authenticatedUser.UserId, id), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : EndpointResultMapper.Failure(result.Error);
    }

    private static int ParsePositiveInt(string? value, int fallback)
    {
        return int.TryParse(value, out var parsed) && parsed > 0 ? parsed : fallback;
    }

    public sealed record ContactRequest(string Name, string Email, string Address, string Phone, string? Observations);
}
