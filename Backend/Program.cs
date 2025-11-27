using ZoiesAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS to allow requests from Live Server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLiveServer",
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Initialize database on startup
var dbService = new DatabaseService(builder.Configuration);
await dbService.InitializeDatabase();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global exception handler - MUST be before other middleware
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ UNHANDLED EXCEPTION: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
            Console.WriteLine($"Inner stack: {ex.InnerException.StackTrace}");
        }
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync($"{{\"error\":\"{ex.Message.Replace("\"", "\\\"")}\"}}");
    }
});

app.UseCors("AllowLiveServer");
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("🚀 Zoie's Accessories API running on http://localhost:5000");
Console.WriteLine("✨ Ready to accept requests from VS Code Live Server!");

try
{
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"❌ FATAL ERROR: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
}
