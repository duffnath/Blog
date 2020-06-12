## Script to update Procuts page with reviews from Google
$pageLocation = "./src/pages/products/index.md"

$productsContent = Get-Content $pageLocation -Raw

$testimonialsIndex = $productsContent.IndexOf("testimonials:")

## Get reviews
$placeID = "$(google_placeID)"
$apiKey = "$(google_apiKey)"
$queryString = "place_id=$placeID&fields=name,rating,formatted_phone_number,reviews&key=$apiKey"

$placeUri = "https://maps.googleapis.com/maps/api/place/details/json?$queryString"

$reviews = ((IWR $placeUri).Content | Convertfrom-Json).result.reviews

## Append reviews to site page
$content = ""

$content += "testimonials:`n"

foreach ($review in $reviews) {
    $content += "  - author: $($review.author_name)`n"
    $content += "    quote: >-`n"
    $content += "      $($review.text)`n"
}

$content += "---"

Set-Content $pageLocation -Value ($productsContent.substring(0,$testimonialsIndex) + $content)
