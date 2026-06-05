FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Agenda.sln global.json ./
COPY src/Agenda/Agenda.csproj src/Agenda/
COPY tests/Agenda.Tests/Agenda.Tests.csproj tests/Agenda.Tests/
RUN dotnet restore Agenda.sln

COPY . .
RUN dotnet publish src/Agenda/Agenda.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5080
ENTRYPOINT ["dotnet", "Agenda.dll"]
