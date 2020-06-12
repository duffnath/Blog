## Script to update Procuts page with reviews from Google
param (
    $placeID = $ENV:google_placeID,
    $apiKey = $ENV:google_apiKey
)

$pageLocation = "./src/pages/products/index.md"

$productsContent = Get-Content $pageLocation -Raw

$testimonialsIndex = $productsContent.IndexOf("testimonials:")

## Get reviews
$queryString = "place_id=$placeID&fields=name,rating,formatted_phone_number,reviews&key=$apiKey"

$placeUri = "https://maps.googleapis.com/maps/api/place/details/json?$queryString"

$reviews = ((IWR $placeUri).Content | Convertfrom-Json).result.reviews

Write-Output (ConvertTo-Json $reviews)

if ($reviews.Count -lt 1) {
    throw "No reviews found"
}

## Append reviews to site page
$content = ""

$content += "testimonials:`n"

foreach ($review in $reviews) {
    $content += "  - author: $($review.author_name)`n"
    $content += "    quote: >-`n"
    $content += "      $($review.text)`n"
}

$content += "---"

$newContent = ($productsContent.substring(0,$testimonialsIndex) + $content)

Write-Output $newContent

Set-Content $pageLocation -Value $newContent -Force -Verbose
