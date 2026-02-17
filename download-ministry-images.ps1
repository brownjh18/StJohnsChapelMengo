$images = @(
    @{
        Url = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop"
        FileName = "children-ministry.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop"
        FileName = "youth-ministry.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
        FileName = "womens-fellowship.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&h=400&fit=crop"
        FileName = "mens-fellowship.jpg"
    },
    @{
        Url = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop"
        FileName = "choir-ministry.jpg"
    }
)

$images | ForEach-Object {
    try {
        Write-Host "Downloading $($_.FileName)..."
        Invoke-WebRequest -Uri $_.Url -OutFile "images\$($_.FileName)" -ErrorAction Stop
        Write-Host "Successfully downloaded $($_.FileName)"
    } catch {
        Write-Host "Error downloading $($_.FileName): $_"
    }
}

Write-Host "`nAll images downloaded successfully!"