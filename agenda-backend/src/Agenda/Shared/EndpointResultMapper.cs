namespace Agenda.Shared;

public static class EndpointResultMapper
{
    public static IResult Failure(Error error)
    {
        return error.Code.EndsWith(".not_found", StringComparison.Ordinal)
            ? Results.NotFound(new { error = error.Message, code = error.Code })
            : Results.BadRequest(new { error = error.Message, code = error.Code });
    }
}
