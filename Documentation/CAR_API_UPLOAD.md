# Car API with Image Upload

## POST /api/cars

Creates a new car with optional image uploads.

### Request Format

**Content-Type:** `multipart/form-data`

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| brand | string | Yes | Car brand (e.g., "Toyota") |
| model | string | Yes | Car model (e.g., "Camry") |
| type | string | Yes | Car type (sedan, suv, hatchback, etc.) |
| year | number | Yes | Manufacturing year |
| daily_rate | number | Yes | Daily rental rate |
| fuel_type | string | Yes | Fuel type (petrol, diesel, electric, hybrid) |
| transmission | string | Yes | Transmission type (manual, automatic) |
| capacity | number | Yes | Seating capacity |
| mileage | number | No | Car mileage |
| description | string | No | Car description |
| images | file[] | No | Car images (max 5 files, 5MB each) |

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

### Example Request (using curl)

```bash
curl -X POST http://localhost:8000/api/cars \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "brand=Toyota" \
  -F "model=Camry" \
  -F "type=sedan" \
  -F "year=2021" \
  -F "daily_rate=50" \
  -F "fuel_type=petrol" \
  -F "transmission=automatic" \
  -F "capacity=5" \
  -F "description=Comfortable sedan for city driving" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Example Request (using JavaScript/FormData)

```javascript
const formData = new FormData();
formData.append('brand', 'Toyota');
formData.append('model', 'Camry');
formData.append('type', 'sedan');
formData.append('year', '2021');
formData.append('daily_rate', '50');
formData.append('fuel_type', 'petrol');
formData.append('transmission', 'automatic');
formData.append('capacity', '5');
formData.append('description', 'Comfortable sedan for city driving');

// Add image files
const imageFiles = document.getElementById('imageInput').files;
for (let i = 0; i < imageFiles.length; i++) {
  formData.append('images', imageFiles[i]);
}

fetch('http://localhost:8000/api/cars', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "b00c999b-2ba9-45b4-b945-1fff857b8134",
    "brand": "Toyota",
    "model": "Camry",
    "type": "sedan",
    "year": 2021,
    "daily_rate": 50,
    "fuel_type": "petrol",
    "transmission": "automatic",
    "capacity": 5,
    "mileage": null,
    "availability_status": "available",
    "image_url": "https://aqgyaocqgrvivmzjahjq.supabase.co/storage/v1/object/public/car-images/1763880242780-0.jpg",
    "description": "Comfortable sedan for city driving",
    "created_by": "10e78cbf-c04a-4391-bb26-7c39fbe6a43c",
    "created_at": "2025-11-23T06:38:47.909624+00:00",
    "updated_at": "2025-11-23T06:38:47.909624+00:00"
  }
}
```

### Error Responses

#### File Too Large
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB."
}
```

#### Too Many Files
```json
{
  "success": false,
  "message": "Too many files. Maximum is 5 files."
}
```

#### Invalid File Type
```json
{
  "success": false,
  "message": "Only image files are allowed"
}
```

#### Upload Failed
```json
{
  "success": false,
  "message": "Image upload failed: [error details]"
}
```

### Notes

- Images are uploaded to Supabase Storage in the `car-images` bucket
- Only the first uploaded image URL is stored in the `image_url` field
- Supported image formats: JPG, JPEG, PNG, GIF, WebP
- Maximum file size: 5MB per image
- Maximum files: 5 images per request
- Images are automatically made public and accessible via URL