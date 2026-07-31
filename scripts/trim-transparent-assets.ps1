Add-Type -AssemblyName System.Drawing
$source = 'public/assets/final/landing/landing_logo_meme_physics_lab_67.png'
$target = 'public/assets/final/landing_logo_meme_physics_lab_67_tight.png'
$margin = 16
$image = [System.Drawing.Bitmap]::FromFile((Resolve-Path $source))
$left = $image.Width; $top = $image.Height; $right = -1; $bottom = -1
for ($y = 0; $y -lt $image.Height; $y++) { for ($x = 0; $x -lt $image.Width; $x++) { if ($image.GetPixel($x, $y).A -gt 0) { $left = [Math]::Min($left, $x); $top = [Math]::Min($top, $y); $right = [Math]::Max($right, $x); $bottom = [Math]::Max($bottom, $y) } } }
if ($right -lt 0) { throw 'No visible pixels found in source logo.' }
$left = [Math]::Max(0, $left - $margin); $top = [Math]::Max(0, $top - $margin); $right = [Math]::Min($image.Width - 1, $right + $margin); $bottom = [Math]::Min($image.Height - 1, $bottom + $margin)
$crop = New-Object System.Drawing.Bitmap ($right - $left + 1), ($bottom - $top + 1)
$graphics = [System.Drawing.Graphics]::FromImage($crop)
$graphics.DrawImage($image, (New-Object System.Drawing.Rectangle 0, 0, $crop.Width, $crop.Height), (New-Object System.Drawing.Rectangle $left, $top, $crop.Width, $crop.Height), [System.Drawing.GraphicsUnit]::Pixel)
$crop.Save((Join-Path (Get-Location) $target), [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose(); $crop.Dispose(); $image.Dispose()
Write-Output "$source -> $target ($($right - $left + 1)x$($bottom - $top + 1))"
