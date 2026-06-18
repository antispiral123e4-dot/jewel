Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $root "assets"
New-Item -ItemType Directory -Force -Path $assets | Out-Null

function New-Canvas($width, $height, $path, [scriptblock]$draw) {
    $bitmap = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    & $draw $graphics $width $height
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

function Brush($hex) {
    return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Pen($hex, $width = 4) {
    return New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($hex)), $width
}

function FillCircle($g, $x, $y, $size, $color) {
    $g.FillEllipse((Brush $color), $x, $y, $size, $size)
    $g.FillEllipse((Brush "#ffffff"), ($x + $size * .18), ($y + $size * .16), ($size * .28), ($size * .16))
}

function DrawBracelet($g, $cx, $cy, $rx, $ry, $size, $colors) {
    for ($i = 0; $i -lt 34; $i++) {
        $angle = (2 * [Math]::PI * $i / 34)
        $x = $cx + [Math]::Cos($angle) * $rx - $size / 2
        $y = $cy + [Math]::Sin($angle) * $ry - $size / 2
        FillCircle $g $x $y $size $colors[$i % $colors.Length]
    }
}

$palette = @("#ff7abd", "#c9a7ff", "#ffe27a", "#9ee9d7", "#8ed6ff", "#ff4fa3")

New-Canvas 1800 1050 (Join-Path $assets "hero-bracelets.png") {
    param($g, $w, $h)
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#fff8ea"))
    for ($i = 0; $i -lt 46; $i++) {
        $x = Get-Random -Minimum 30 -Maximum ($w - 60)
        $y = Get-Random -Minimum 25 -Maximum ($h - 55)
        $c = $palette[$i % $palette.Length]
        $g.FillEllipse((Brush $c), $x, $y, 14, 14)
    }
    DrawBracelet $g 1220 510 315 155 58 $palette
    DrawBracelet $g 1160 600 300 145 52 @("#c9a7ff", "#9ee9d7", "#ffe27a", "#ff7abd")
    DrawBracelet $g 1320 665 260 128 45 @("#8ed6ff", "#ff4fa3", "#ffe27a", "#9ee9d7")
    $font = New-Object System.Drawing.Font "Arial", 64, ([System.Drawing.FontStyle]::Bold)
    $g.DrawString("BJ", $font, (Brush "#ff4fa3"), 1360, 440)
}

New-Canvas 1000 1000 (Join-Path $assets "lifestyle-stack.png") {
    param($g, $w, $h)
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#fdf1ff"))
    $g.FillRectangle((Brush "#fff8ea"), 0, 630, $w, 370)
    $skin = Brush "#d99a78"
    $g.FillPie($skin, 230, 420, 720, 780, 194, 110)
    DrawBracelet $g 575 695 245 48 44 @("#ff7abd", "#ffe27a", "#9ee9d7", "#8ed6ff")
    DrawBracelet $g 590 755 250 48 42 @("#c9a7ff", "#ff4fa3", "#ffe27a", "#9ee9d7")
    DrawBracelet $g 600 815 250 48 40 @("#8ed6ff", "#ff7abd", "#c9a7ff")
    $g.FillEllipse((Brush "#ff7abd"), 120, 90, 190, 190)
    $g.FillRectangle((Brush "#9ee9d7"), 650, 110, 210, 260)
}

New-Canvas 1000 1000 (Join-Path $assets "macro-beads.png") {
    param($g, $w, $h)
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#fff8ea"))
    for ($row = -1; $row -lt 8; $row++) {
        for ($col = -1; $col -lt 8; $col++) {
            $color = $palette[($row + $col + 12) % $palette.Length]
            FillCircle $g ($col * 150 + 20) ($row * 145 + 30) 126 $color
        }
    }
}

$products = @(
    @{ name = "cotton-candy-stack"; colors = @("#ff7abd", "#c9a7ff", "#8ed6ff") },
    @{ name = "mint-star-solo"; colors = @("#9ee9d7", "#ffe27a", "#ff4fa3") },
    @{ name = "fruit-pop-charms"; colors = @("#ff7abd", "#ffe27a", "#9ee9d7", "#8ed6ff") },
    @{ name = "grape-glow-set"; colors = @("#c9a7ff", "#ff4fa3", "#8ed6ff") },
    @{ name = "sunny-ankle-jelly"; colors = @("#ffe27a", "#9ee9d7", "#ff7abd") },
    @{ name = "jelly-loop-keychain"; colors = @("#ff7abd", "#9ee9d7", "#ffe27a", "#8ed6ff") },
    @{ name = "party-kit"; colors = @("#ff4fa3", "#c9a7ff", "#ffe27a", "#9ee9d7", "#8ed6ff") }
)

foreach ($product in $products) {
    New-Canvas 900 900 (Join-Path $assets "$($product.name).png") {
        param($g, $w, $h)
        $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#fff8ea"))
        $g.FillEllipse((Brush "#ffffff"), 135, 130, 630, 630)
        DrawBracelet $g 450 450 245 135 50 $product.colors
        DrawBracelet $g 450 480 210 112 42 $product.colors
        if ($product.name -eq "jelly-loop-keychain") {
            $ringPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#e90d86")), 22
            $ringPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
            $ringPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
            $g.DrawArc($ringPen, 338, 110, 224, 224, 205, 310)
            $g.FillEllipse((Brush "#ffffff"), 392, 165, 116, 116)
            $g.FillEllipse((Brush "#e90d86"), 420, 194, 60, 60)
            $g.FillEllipse((Brush "#ffffff"), 434, 208, 32, 32)
            $g.FillRectangle((Brush "#e90d86"), 430, 285, 42, 105)
            $g.FillEllipse((Brush "#ff7abd"), 395, 375, 112, 86)
        }
    }
}
