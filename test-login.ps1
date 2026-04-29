$body = @{
    email = "admin@escola.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -ContentType 'application/json' -Body $body

Crie uma pasta chamada linearclone e execute este comando para trazer o DESIGN.md do projeto npx getdesign@latest add linear.app/linearclone DESIGN.md