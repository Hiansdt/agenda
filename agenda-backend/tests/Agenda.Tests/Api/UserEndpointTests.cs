using Agenda.Modules.Users.Application.Abstractions;
using Agenda.Modules.Users.Domain;
using Agenda.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Net;
using System.Net.Http.Json;

namespace Agenda.Tests.Api;

public sealed class UserEndpointTests
{
    [Fact]
    public async Task Login_SetsHttpOnlySessionCookie()
    {
        using var factory = new TestAgendaFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/users/login", new
        {
            email = "maria@example.com",
            password = "password123"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var setCookie = Assert.Single(response.Headers.GetValues("Set-Cookie"));
        Assert.Contains("agenda.session=", setCookie);
        Assert.Contains("httponly", setCookie, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Contacts_RejectsAnonymousRequests()
    {
        using var factory = new TestAgendaFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/contacts");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_Preflight_AllowsFrontendOrigin()
    {
        using var factory = new TestAgendaFactory();
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Options, "/users/login");
        request.Headers.Add("Origin", "http://localhost:3002");
        request.Headers.Add("Access-Control-Request-Method", "POST");
        request.Headers.Add("Access-Control-Request-Headers", "content-type");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal("http://localhost:3002", Assert.Single(response.Headers.GetValues("Access-Control-Allow-Origin")));
        Assert.Equal("true", Assert.Single(response.Headers.GetValues("Access-Control-Allow-Credentials")));
    }

    [Fact]
    public async Task Register_Preflight_AllowsCommonNextDevOrigin()
    {
        using var factory = new TestAgendaFactory();
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Options, "/users");
        request.Headers.Add("Origin", "http://localhost:3000");
        request.Headers.Add("Access-Control-Request-Method", "POST");
        request.Headers.Add("Access-Control-Request-Headers", "content-type");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal("http://localhost:3000", Assert.Single(response.Headers.GetValues("Access-Control-Allow-Origin")));
        Assert.Equal("true", Assert.Single(response.Headers.GetValues("Access-Control-Allow-Credentials")));
    }

    private sealed class TestAgendaFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<IUserRepository>();
                services.RemoveAll<IPasswordService>();
                services.RemoveAll<ITokenService>();
                services.RemoveAll<IUnitOfWork>();

                services.AddScoped<IUserRepository, FakeUserRepository>();
                services.AddScoped<IPasswordService, FakePasswordService>();
                services.AddScoped<ITokenService, FakeTokenService>();
                services.AddScoped<IUnitOfWork, FakeUnitOfWork>();
            });
        }
    }

    private sealed class FakeUserRepository : IUserRepository
    {
        private readonly User _user = User.Register("Maria", "maria@example.com", "hashed-password123", DateTimeOffset.UtcNow);

        public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(id == _user.Id ? _user : null);

        public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken) =>
            Task.FromResult(email.Trim().ToLowerInvariant() == _user.Email ? _user : null);

        public Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(id == _user.Id);

        public void Add(User user)
        {
        }
    }

    private sealed class FakePasswordService : IPasswordService
    {
        public string Hash(string password) => $"hashed-{password}";
        public bool Verify(string password, string passwordHash) => passwordHash == Hash(password);
    }

    private sealed class FakeTokenService : ITokenService
    {
        public string Generate(User user) => "test-token";
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(1);
    }
}
