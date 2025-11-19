# Custom focus areas

When cropping images, or placing layers, you may have certain areas of interest in the composition of the picture that you want to focus on. Although there are [AI-based ways](ai_in_action#ai_content_analysis_for_transformations) to focus on areas of an image, sometimes you need to ensure accuracy and consistency, so Cloudinary provides the capability to define and refine custom areas of an image.

Use custom coordinatesfor croppingand overlays

Use custom regionsfor cropping

Override coordinates forface-detection basedtransformations

This guide focuses on [custom coordinates](#custom_coordinates) (including [on-the-fly custom coordinates](#custom_coordinates_on_the_fly)), [custom regions](#custom_regions) and [custom face coordinates](#custom_face_coordinates), which allow you to define specific areas of an image to focus on (also known as `gravity`). You can learn more about gravity in [Gravity positions for crops](resizing_and_cropping#control_gravity) and [Image layer placement](layers#layer_placement). You may also be interested in [Face-detection based transformations](face_detection_based_transformations).

> **TIP**: Each of the sections describes how to set the focus areas programmatically, but you can also use the [Focus Area Refiner](#focus_area_refiner).

## Custom coordinates

If you know which part of an image you want to focus on, you can specify the coordinates of its bounding box while uploading the image using the `custom_coordinates` parameter of the [upload](image_upload_api_reference#upload) method. You can also set the `custom_coordinates` parameter for an existing image, either using the [explicit](image_upload_api_reference#explicit) method of the Upload API, or the [update](admin_api#update_details_of_an_existing_resource) method of the Admin API.

The coordinates indicate a region contained in the image that can be used for cropping or adding layers using the `custom` [gravity mode](transformation_reference#g_special_position). 

Specify the area by the X and Y coordinates of the top left corner and the width and height of the region, as a comma-separated list. For example, `225,230,250,240`. In an SDK you can specify this as an array, for example, `[225, 230, 250, 240]`.

```multi
|ruby  
result = Cloudinary::Uploader
.upload("bedroom.jpg",
  custom_coordinates: [225, 230, 250, 240])
 
|php_2
$result = $cloudinary->uploadApi()
->upload("bedroom.jpg", 
  "custom_coordinates" => [225, 230, 250, 240]);

|python
result = cloudinary.uploader\
.upload("bedroom.jpg", 
   custom_coordinates = [225, 230, 250, 240])


|nodejs
cloudinary.v2.uploader
.upload("bedroom.jpg", {
  custom_coordinates: [225, 230, 250, 240]
 }) 
  .then(result=>console.log(result));
  
|java
Coordinates coordinates = new Coordinates();
Rectangle rect1 = new Rectangle(225, 230, 250, 240);
coordinates.addRect(rect1);
result = cloudinary.uploader()
.upload("bedroom.jpg", 
  ObjectUtils.asMap(
    "custom_coordinates", coordinates));

|csharp
var coordinates = new Core.Rectangle(225, 230, 250, 240);
var uploadParams = new ImageUploadParams(){
  File = new FileDescription(@"bedroom.jpg"),
  CustomCoordinates = coordinates
};
var uploadResult = cloudinary.Upload(uploadParams);  

|go
resp, err := cld.Upload.Upload(ctx, "bedroom.jpg", uploader.UploadParams{
      CustomCoordinates: [225, 230, 250, 240]})

|android
Coordinates coordinates = new Coordinates();
Rectangle rect1 = new Rectangle(225, 230, 250, 240);
coordinates.addRect(rect1);
MediaManager.get().upload("bedroom.jpg")
  .option("custom_coordinates", coordinates).dispatch();

|dart
import 'package:cloudinary_api/src/request/model/params/coordinates.dart';
...
var coordinates = Coordinates.withString('225, 230, 250, 240');
var response = await cloudinary.uploader().upload(File('bedroom.jpg'),
      params: UploadParams(
          customCoordinates: coordinates));

|swift
let coordinate = CLDCoordinate(rect: CGRect(x: 225, y: 230, width: 250, height: 240))
let params = CLDUploadRequestParams().setCustomCoordinates([coordinate])
var mySig = MyFunction(params)  // your own function that returns a signature generated on your backend
params.setSignature(CLDSignature(signature: mySig.signature, timestamp: mySig.timestamp))
let request = cloudinary.createUploader().signedUpload(url: "bedroom.jpg", params: params)

|curl
curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=bedroom.jpg&custom_coordinates=225,230,250,240&timestamp=173719931&api_key=614335564976464&signature=a788d68f86a6f868af' 

|cli
cld uploader upload 'bedroom.jpg' custom_coordinates='[225, 230, 250, 240]'
```

The response includes the set coordinates:

```json
  "asset_id": "7b7a0f2da95f21584b82e5a9d399783c",
  "public_id": "zadsz8n8icrm5z9zf5we",
  ...
  "coordinates": {
    "custom": [
      [
        225.0,
        230.0,
        250.0,
        240.0
      ]
    ]
  },
...
```

### Crop with custom coordinates

This is the uploaded image:

![Original image of a bedroom](https://res.cloudinary.com/cld-docs/image/upload/zadsz8n8icrm5z9zf5we.jpg "thumb: c_scale,w_300, popup:true, with_url:true, width:300")

You can crop the image to the exact area defined by the custom coordinates using the `crop` mode and `custom` gravity (`c_crop,g_custom`):

![Cropped image using crop, focussing on the custom coordinates](https://res.cloudinary.com/cld-docs/image/upload/c_crop,g_custom/zadsz8n8icrm5z9zf5we.jpg "with_code:true, with_url:true, popup:true, width_250")

### Custom coordinates with auto gravity 

The custom coordinates override automatic gravity (`g_auto`), 
but if you don't want them to, then you can specify `none` for the gravity focal point:

![Cropped image using fill cropping, focussing on the custom coordinates](https://res.cloudinary.com/cld-docs/image/upload/c_auto,g_auto:none,h_500,w_250/zadsz8n8icrm5z9zf5we.jpg "with_code:true, with_url:true, with_image:false, width_250")

g_auto(overridden by custom coordinates)

g_auto:none(custom coordinates are ignored)

If you want to weight the gravity towards the custom coordinates, but not override the automatic gravity entirely, then specify `custom_no_override` as a focal point. You can also take other objects into account, in addition to your custom coordinates, for example the bed:

![Cropped image using automatic gravity, with custom coordinates and the bed as focal points](https://res.cloudinary.com/cld-docs/image/upload/c_auto,g_auto:custom_no_override:bed,h_500,w_250/zadsz8n8icrm5z9zf5we.jpg "with_code:true, with_url:true, popup:true, width:250")

### Overlay with custom coordinates

You can use custom coordinates to position overlays on an image by specifying `custom` gravity. In this example, the sale icon is scaled down to 75% of the custom area and overlaid in the center of that area: 

![Sale icon overlaid on area defined by custom coordinates](https://res.cloudinary.com/cld-docs/image/upload/l_sale_icon/c_scale,fl_region_relative,w_0.75/fl_layer_apply,g_custom/zadsz8n8icrm5z9zf5we.jpg "thumb: c_scale,w_500, with_code:true, with_url:true, popup:true, width:500")

### Multiple custom coordinates

You can add more than one set of custom coordinates using the following syntax:

```multi
|ruby  
result = Cloudinary::Uploader
.upload("bedroom.jpg",
  custom_coordinates: [[225, 230, 250, 240], [300, 230, 300, 240]])

|php_2
$result = $cloudinary->uploadApi()
->upload("bedroom.jpg", 
  ["custom_coordinates" => [[225, 230, 250, 240], [300, 230, 300, 240]]]);

|python
result = cloudinary.uploader\
.upload("bedroom.jpg", 
   custom_coordinates=[[225, 230, 250, 240], [300, 230, 300, 240]])

|nodejs
cloudinary.v2.uploader
.upload("bedroom.jpg", {
  custom_coordinates: [[225, 230, 250, 240], [300, 230, 300, 240]]
 }) 
  .then(result => console.log(result));

|java
Coordinates coordinates = new Coordinates();
Rectangle rect1 = new Rectangle(225, 230, 250, 240);
Rectangle rect2 = new Rectangle(300, 230, 300, 240);
coordinates.addRect(rect1);
coordinates.addRect(rect2);
result = cloudinary.uploader()
.upload("bedroom.jpg", 
  ObjectUtils.asMap(
    "custom_coordinates", coordinates));

|csharp
var coordinates = new List<Rectangle> {
  new Rectangle(225, 230, 250, 240),
  new Rectangle(300, 230, 300, 240)
};
var uploadParams = new ImageUploadParams(){
  File = new FileDescription(@"bedroom.jpg"),
  CustomCoordinates = coordinates
};
var uploadResult = cloudinary.Upload(uploadParams);  

|go
resp, err := cld.Upload.Upload(ctx, "bedroom.jpg", uploader.UploadParams{
      CustomCoordinates: [][]int{{225, 230, 250, 240}, {300, 230, 300, 240}}})

|android
Coordinates coordinates = new Coordinates();
Rectangle rect1 = new Rectangle(225, 230, 250, 240);
Rectangle rect2 = new Rectangle(300, 230, 300, 240);
coordinates.addRect(rect1);
coordinates.addRect(rect2);
MediaManager.get().upload("bedroom.jpg")
  .option("custom_coordinates", coordinates).dispatch();

|dart
import 'package:cloudinary_api/src/request/model/params/coordinates.dart';
...
var coordinates = Coordinates.withString('225, 230, 250, 240|300, 230, 300, 240');
var response = await cloudinary.uploader().upload(File('bedroom.jpg'),
      params: UploadParams(
          customCoordinates: coordinates));

|swift
let coordinate1 = CLDCoordinate(rect: CGRect(x: 225, y: 230, width: 250, height: 240))
let coordinate2 = CLDCoordinate(rect: CGRect(x: 300, y: 230, width: 300, height: 240))
let params = CLDUploadRequestParams().setCustomCoordinates([coordinate1, coordinate2])
var mySig = MyFunction(params)
params.setSignature(CLDSignature(signature: mySig.signature, timestamp: mySig.timestamp))
let request = cloudinary.createUploader().signedUpload(url: "bedroom.jpg", params: params)

|curl
curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST \
--data 'file=bedroom.jpg&custom_coordinates=225,230,250,240|300,230,300,240&timestamp=173719931&api_key=614335564976464&signature=a788d68f86a6f868af' 

|cli
cld uploader upload 'bedroom.jpg' custom_coordinates='[[225, 230, 250, 240],[300, 230, 300, 240]]'
```

If an image has more than one set of custom coordinates defined, then the [cropping](#crop_with_custom_coordinates) and [overlay](#overlay_with_custom_coordinates) mechanisms use the largest of the defined areas.

> **TIP**: You can create [conditional transformations](conditional_transformations) based on the number of custom coordinate sets defined (`ccc`). 

For example, overlay the sale icon only if there is one custom coordinate set defined: (`if_ccc_eq_1`):

![Sale icon overlaid on area defined by custom coordinates](https://res.cloudinary.com/cld-docs/image/upload/if_ccc_eq_1/l_sale_icon/c_scale,fl_region_relative,w_0.75/fl_layer_apply,g_custom/if_end/zadsz8n8icrm5z9zf5we.jpg "thumb: c_scale,w_300, with_code:true, with_url:true, popup:true, width:300")

Here's the same transformation for an image that doesn't have any custom coordinates defined:

![No sale icon on the image](https://res.cloudinary.com/cld-docs/image/upload/if_ccc_eq_1/l_sale_icon/c_scale,fl_region_relative,w_0.75/fl_layer_apply,g_custom/if_end/8jsb1xofxdqamu2rzwt9q.jpg "thumb: c_scale,w_300, with_code:true, with_url:true, popup:true, width:300")

## Custom coordinates on the fly

You can specify custom coordinates directly in the transformation URL using the `aoi` (area of interest) focal position of auto gravity. 

Specify the area by the X and Y coordinates of the top left corner and the width and height of the region, joined with underscores: `<top left x>_<top left y>_<width>_<height>`.

Custom coordinates specified on the fly override any [custom coordinates](#custom_coordinates) already specified for an image.

For example, automatically extract a 330 x 160 pixel area of an image, starting at (420, 230)  (`g_auto:aoi_420_230_330_160`):

![Auto cropping with custom coordinates](https://res.cloudinary.com/demo/image/upload/c_crop,g_auto:aoi_420_230_330_160,h_200,w_400/docs/addons/objectdetection/automobile-1853936_1920.jpg "thumb: h_150")

```nodejs
cloudinary.image("docs/addons/objectdetection/automobile-1853936_1920.jpg", {gravity: "auto:aoi_420_230_330_160", height: 200, width: 400, crop: "crop"})
```

```react
new CloudinaryImage(
  "docs/addons/objectdetection/automobile-1853936_1920.jpg"
).addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400");
```

```vue
new CloudinaryImage(
  "docs/addons/objectdetection/automobile-1853936_1920.jpg"
).addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400");
```

```angular
new CloudinaryImage(
  "docs/addons/objectdetection/automobile-1853936_1920.jpg"
).addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400");
```

```js
new CloudinaryImage(
  "docs/addons/objectdetection/automobile-1853936_1920.jpg"
).addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400");
```

```python
CloudinaryImage("docs/addons/objectdetection/automobile-1853936_1920.jpg").image(gravity="auto:aoi_420_230_330_160", height=200, width=400, crop="crop")
```

```php
(new ImageTag('docs/addons/objectdetection/automobile-1853936_1920.jpg'))
	->addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400");
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto:aoi_420_230_330_160").height(200).width(400).crop("crop")).imageTag("docs/addons/objectdetection/automobile-1853936_1920.jpg");
```

```ruby
cl_image_tag("docs/addons/objectdetection/automobile-1853936_1920.jpg", gravity: "auto:aoi_420_230_330_160", height: 200, width: 400, crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto:aoi_420_230_330_160").Height(200).Width(400).Crop("crop")).BuildImageTag("docs/addons/objectdetection/automobile-1853936_1920.jpg")
```

```dart
cloudinary.image('docs/addons/objectdetection/automobile-1853936_1920.jpg').transformation(Transformation()
	.addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto:aoi_420_230_330_160").setHeight(200).setWidth(400).setCrop("crop")).generate("docs/addons/objectdetection/automobile-1853936_1920.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto:aoi_420_230_330_160").height(200).width(400).crop("crop")).generate("docs/addons/objectdetection/automobile-1853936_1920.jpg");
```

```flutter
cloudinary.image('docs/addons/objectdetection/automobile-1853936_1920.jpg').transformation(Transformation()
	.addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400"));
```

```kotlin
cloudinary.image {
	publicId("docs/addons/objectdetection/automobile-1853936_1920.jpg")
	 addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400") 
}.generate()
```

```jquery
$.cloudinary.image("docs/addons/objectdetection/automobile-1853936_1920.jpg", {gravity: "auto:aoi_420_230_330_160", height: 200, width: 400, crop: "crop"})
```

```react_native
new CloudinaryImage(
  "docs/addons/objectdetection/automobile-1853936_1920.jpg"
).addTransformation("c_crop,g_auto:aoi_420_230_330_160,h_200,w_400");
```

> **NOTE**: On-the-fly custom coordinates can only be used for cropping, and not for overlays.

## Custom regions

You can define custom regions in an image, which you can name, and use as gravity for cropping. 

To define custom regions, set the `regions` parameter of the [upload](image_upload_api_reference#regions_upload), [explicit](image_upload_api_reference#regions_explicit) or [update](admin_api#regions) methods. 

Each region is specified by a name (alphanumeric characters and hyphens permitted) and an array of at least two X,Y coordinate pairs, e.g., `{ "name1": [[1, 2], [3, 4]], "name2": [[5,6], [7,8], [9,10]] }`. If two pairs are specified, these refer to the top left and bottom right coordinates of a rectangle. Otherwise, if more pairs are specified, they refer to the corners of a custom region.

```multi
   
|python
result = cloudinary.uploader\
.upload("clothing.jpg", 
  regions = {"hat": [[2720, 770], [3700, 1920]], "shoes": [[3200, 6200], [4900, 8140]]}
)


|nodejs
cloudinary.v2.uploader
.upload("clothing.jpg", {
    regions: {
      'hat': [[2720, 770], [3700, 1920]],
      'shoes': [[3200, 6200], [4900, 8140]]
    }
 }) 
  .then(result=>console.log(result));
  
|curl
curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST \
-H "Content-Type: application/json" \
-d '{
      "file": "clothing.jpg",
      "regions": {
          "hat": [[2720, 770], [3700, 1920]],
          "shoes": [[3200, 6200], [4900, 8140]]
      },
      "timestamp": 173719931,
      "api_key": "614335564976464",
      "signature": "a788d68f86a6f868af"
    }'


|cli
cld uploader upload 'clothing.jpg' regions='{"hat": [[2720, 770], [3700, 1920]], "shoes": [[3200, 6200], [4900, 8140]]}'
```

The response includes the regions:

```json
{
  "asset_id": "b25731892425b43ddf88990e8670a3a9",
  "public_id": "vrbzygr9odqz4aioofs0",
  ...
  "regions": [
    {
      "name": "hat",
      "values": [
        [
          2720,
          770
        ],
        [
          3700,
          1920
        ]
      ]
    },
    {
      "name": "shoes",
      "values": [
        [
          3200,
          6200
        ],
        [
          4900,
          8140
        ]
      ]
    }
  ],
  ...
}
```

### Crop with custom regions

This is the uploaded image:

![Image with regions defined](https://res.cloudinary.com/cld-docs/image/upload/vrbzygr9odqz4aioofs0.jpg "thumb: c_scale,w_250, width: 250, with_image:true, with_code:false, with_url:true, popup:true")

You can use the named regions when defining gravity for a crop. For example, create a thumbnail of an image 150 pixels square while focusing on the region defined as `shoes` (`c_auto,g_region_!shoes!,h_150,w_150`):
    
![Crop to 150x150 focusing on the region named shoes](https://res.cloudinary.com/cld-docs/image/upload/c_auto,g_region_!shoes!,h_150,w_150/vrbzygr9odqz4aioofs0.jpg "with_url:true, with_code:true width:150 popup:true")

And the same for the region named `hat`:

![Crop to 150x150 focusing on the region named hat](https://res.cloudinary.com/cld-docs/image/upload/c_auto,g_region_!hat!,h_150,w_150/vrbzygr9odqz4aioofs0.jpg "with_url:true, with_code:true width: 150 popup:true")

> **TIP**: You can create [conditional transformations](conditional_transformations) based on the number of regions defined (`rc`), and the names of the regions (`rn`). 

For example, crop this image only if there is a region named `hat` defined (`if_!hat!_in_rn`):

![Conditionally crop if the region exists](https://res.cloudinary.com/cld-docs/image/upload/if_!hat!_in_rn/c_auto,g_region_!hat!,h_150,w_150/if_end/vrbzygr9odqz4aioofs0.jpg "with_url:true, with_code:true width: 150 popup:true")

**See full syntax**: [g_region](transformation_reference#g_region) in the _Transformation Reference_.

## Custom face coordinates

When images are uploaded to your product environment, Cloudinary automatically detects faces in the images and stores the coordinates of those faces for use with [face-detection based transformations](face_detection_based_transformations). For example, this image was uploaded with no special parameters, and yet you can specify `c_crop,g_face` to crop to the face:

![Face cropped](https://res.cloudinary.com/demo/image/upload/c_crop,g_face/standing_woman.jpg "with_image:false")

```nodejs
cloudinary.image("standing_woman.jpg", {gravity: "face", crop: "crop"})
```

```react
new CloudinaryImage("standing_woman.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```vue
new CloudinaryImage("standing_woman.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```angular
new CloudinaryImage("standing_woman.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```js
new CloudinaryImage("standing_woman.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```python
CloudinaryImage("standing_woman.jpg").image(gravity="face", crop="crop")
```

```php
(new ImageTag('standing_woman.jpg'))
	->resize(Resize::crop()
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("face").crop("crop")).imageTag("standing_woman.jpg");
```

```ruby
cl_image_tag("standing_woman.jpg", gravity: "face", crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("face").Crop("crop")).BuildImageTag("standing_woman.jpg")
```

```dart
cloudinary.image('standing_woman.jpg').transformation(Transformation()
	.resize(Resize.crop()
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("face").setCrop("crop")).generate("standing_woman.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("face").crop("crop")).generate("standing_woman.jpg");
```

```flutter
cloudinary.image('standing_woman.jpg').transformation(Transformation()
	.resize(Resize.crop()
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```kotlin
cloudinary.image {
	publicId("standing_woman.jpg")
	 resize(Resize.crop() {
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("standing_woman.jpg", {gravity: "face", crop: "crop"})
```

```react_native
new CloudinaryImage("standing_woman.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

Original image

Cropped to the face

You can override these face coordinates, using the `face_coordinates` parameter of the [upload](image_upload_api_reference#upload) method. You can also set the `face_coordinates` parameter for an existing image, either using the [explicit](image_upload_api_reference#explicit) method of the Upload API, or the [update](admin_api#update_details_of_an_existing_resource) method of the Admin API.

Specify a face by the X and Y coordinates of the top left corner and the width and height of the region, as a comma-separated list. For example, `220,80,200,220`. In an SDK you can specify this as an array, for example, `[220, 80, 200, 220]`. You can specify multiple faces by separating each list with a pipe, for example, `220,80,200,220|420,120,180,250`, or as another array in SDKs: `[[220, 80, 200, 220],[420, 120, 180, 250]]`.

In the request, you can set `faces` to `true` to return the coordinates of the faces.

```multi
|ruby  
result = Cloudinary::Uploader
.upload("people-mobile.jpg",
  face_coordinates: [[220, 80, 200, 220],[420, 120, 180, 250]],
  faces: true)
 
|php_2
$result = $cloudinary->uploadApi()
->upload("people-mobile.jpg", 
  "face_coordinates" => [[220, 80, 200, 220],[420, 120, 180, 250]],
  "faces" => true);

|python
result = cloudinary.uploader\
.upload("people-mobile.jpg", 
   face_coordinates = [[220, 80, 200, 220],[420, 120, 180, 250]],
   faces = True)


|nodejs
cloudinary.v2.uploader
.upload("people-mobile.jpg", {
  face_coordinates: [[220, 80, 200, 220],[420, 120, 180, 250]],
  faces: true
 }) 
  .then(result=>console.log(result));
  
|java
Coordinates coordinates = new Coordinates();
Rectangle rect1 = new Rectangle(220, 80, 200, 220);
Rectangle rect2 = new Rectangle(420, 120, 180, 250);
coordinates.addRect(rect1);
coordinates.addRect(rect2);
result = cloudinary.uploader()
.upload("people-mobile.jpg", 
  ObjectUtils.asMap(
    "face_coordinates", coordinates,
    "faces", "true"));

|csharp
var faceCoordinates = new List<CloudinaryDotNet.Core.Rectangle>()
{
    new CloudinaryDotNet.Core.Rectangle(220, 80, 200, 220),
    new CloudinaryDotNet.Core.Rectangle(420, 120, 180, 250)
};

var uploadParams = new ImageUploadParams(){
  File = new FileDescription(@"people-mobile.jpg"),
  FaceCoordinates = faceCoordinates,
  Faces = true
};
var uploadResult = cloudinary.Upload(uploadParams);  

|go
resp, err := cld.Upload.Upload(ctx, "people-mobile.jpg", uploader.UploadParams{
      FaceCoordinates: [[220, 80, 200, 220],[420, 120, 180, 250]],
      Faces: api.Bool(true)})

|android
Coordinates coordinates = new Coordinates();
Rectangle rect1 = new Rectangle(220, 80, 200, 220);
Rectangle rect2 = new Rectangle(420, 120, 180, 250);
coordinates.addRect(rect1);
coordinates.addRect(rect2);
MediaManager.get().upload("people-mobile.jpg")
  .option("face_coordinates", coordinates).
  .option("faces", true).dispatch();

|dart
import 'package:cloudinary_api/src/request/model/params/coordinates.dart';
...

var rect1 = Rectangle(220, 80, 200, 220);
var rect2 = Rectangle(420, 120, 180, 250);

var coordinates = Coordinates([rect1, rect2]);

var response = await cloudinary.uploader().upload(File('people-mobile.jpg'),
      params: UploadParams(
          faceCoordinates: coordinates, 
          faces: true));

|swift
let coordinate = CLDCoordinate(rect: CGRect(x: 220, y: 80, width: 200, height: 220))
let coordinate2 = CLDCoordinate(rect: CGRect(x: 420, y: 120, width: 180, height: 250))
let params = CLDUploadRequestParams().setFaceCoordinates([coordinate, coordinate2]).setFaces("true")
var mySig = MyFunction(params)  // your own function that returns a signature generated on your backend
params.setSignature(CLDSignature(signature: mySig.signature, timestamp: mySig.timestamp))
let request = cloudinary.createUploader().signedUpload(url: "people-mobile.jpg", params: params)

|curl
curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=people-mobile.jpg&face_coordinates=220,80,200,220|410,120,180,250&faces=true&timestamp=173719931&api_key=614335564976464&signature=a788d68f86a6f868af' 

|cli
cld uploader upload 'people-mobile.jpg' face_coordinates='[[220, 80, 200, 220],[420, 120, 180, 250]]' faces=true
```

The response includes the set coordinates:

```json
{
  "asset_id": "a1a4d9993b963fc704c0bca318985efc",
  "public_id": "hbbvgydnr8ct6iiplwar",
  ...
  "faces": [
    [
      220,
      80,
      200,
      220
    ],
    [
      420,
      120,
      180,
      250
    ]
  ],
  "coordinates": {
    "faces": [
      [
        220,
        80,
        200,
        220
      ],
      [
        420,
        120,
        180,
        250
      ]
    ]
  },
...
}

```

This is the uploaded image:

![Custom face coordinates](https://res.cloudinary.com/cld-docs/image/upload/hbbvgydnr8ct6iiplwar.jpg "thumb: c_scale,w_250, width: 250, with_image:true, with_code:false, with_url:true, popup:true")

You can see the coordinates of the automatically detected faces that these custom face coordinates override, by uploading the same image without setting the coordinates (and with the `faces` parameter set to `true`):

```multi
|ruby  
result = Cloudinary::Uploader
.upload("people-mobile.jpg",
  faces: true)
 
|php_2
$result = $cloudinary->uploadApi()
->upload("people-mobile.jpg", 
  "faces" => true);

|python
result = cloudinary.uploader\
.upload("people-mobile.jpg", 
   faces = True)

|nodejs
cloudinary.v2.uploader
.upload("people-mobile.jpg", {
  faces: true
 }) 
  .then(result=>console.log(result));
  
|java
result = cloudinary.uploader()
.upload("people-mobile.jpg", 
  ObjectUtils.asMap(
    "faces", "true"));

|csharp
var uploadParams = new ImageUploadParams(){
  File = new FileDescription(@"people-mobile.jpg"),
  Faces = true
};
var uploadResult = cloudinary.Upload(uploadParams);  

|go
resp, err := cld.Upload.Upload(ctx, "people-mobile.jpg", uploader.UploadParams{
      Faces: api.Bool(true)})

|android
MediaManager.get().upload("people-mobile.jpg")
  .option("faces", true).dispatch();

|dart
import 'package:cloudinary_api/src/request/model/params/coordinates.dart';
...

var response = await cloudinary.uploader().upload(File('people-mobile.jpg'),
      params: UploadParams(
          faces: true));

|swift
let params = CLDUploadRequestParams().setFaces("true")
var mySig = MyFunction(params)  // your own function that returns a signature generated on your backend
params.setSignature(CLDSignature(signature: mySig.signature, timestamp: mySig.timestamp))
let request = cloudinary.createUploader().signedUpload(url: "people-mobile.jpg", params: params)

|curl
curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=people-mobile.jpg&faces=true&timestamp=173719931&api_key=614335564976464&signature=a788d68f86a6f868af' 

|cli
cld uploader upload 'people-mobile.jpg' faces=true
```

```json
{
  "asset_id": "8e1a69e11c1b2161d79c9c21d410f8e9",
  "public_id": "gbmqavnbztz1rdujstxz",
...
  "faces": [
    [
      257,
      140,
      155,
      176
    ],
    [
      407,
      159,
      151,
      228
    ]
  ],
  "coordinates": {
    "faces": [
      [
        257,
        140,
        155,
        176
      ],
      [
        407,
        159,
        151,
        228
      ]
    ]
  },
  ...
}

```

Cropping around the faces, you can see the difference between the automatically determined coordinates and the custom face coordinates:

![Custom face coordinates](https://res.cloudinary.com/cld-docs/image/upload/c_crop,g_faces/hbbvgydnr8ct6iiplwar.jpg "with_image:false, with_code:true, with_url:true")

Automatically determinedface coordinates

Custom face coordinates

### Face-detection based transformations

Setting custom face coordinates means that any of the [face-detection based transformations](face_detection_based_transformations) applied to the image will use those face coordinates instead of the automatically detected ones.

For example, pixelating the faces in the image uploaded with the custom face coordinates:

![Custom face coordinates](https://res.cloudinary.com/cld-docs/image/upload/e_pixelate_faces/hbbvgydnr8ct6iiplwar.jpg "thumb: c_scale,w_250, width:250, with_image:true, with_code:true, with_url:true, popup:true")

## Focus Area Refiner

The **Focus Area Refiner** lets you fine tune, or specify new custom focus areas in an image using a graphical interface.
You can open the Focus Area Refiner for any image from the [Transformation Builder](image_transformations#transformation_builder). Click the (3-dots) option menu on the image thumbnail and click **Select Focus Areas**.

![Thumbnail of the image with the Select Focus Areas option](https://cloudinary-res.cloudinary.com/image/upload/f_auto/q_auto/docs/edit_focus_areas.png "thumb: c_scale,w_500/dpr_2.0, width:500, popup: true")

> **TIP**:
>
> In the Media Library, you can open the **Focus Area Refiner** from the **Analysis** tab of the Manage page. For more information, see [Asset analysis](media_library_for_developers#asset_analysis_images_only).

The Focus Area Refiner contains three tabs:

* **Face**: lets you adjust the areas automatically detected as faces on upload, in addition to adding new ones.
* **Custom**: lets you define or edit a custom region for the image.
* **Region**: lets you define or edit multiple named regions for the image.

![Focus Area Refiner](https://cloudinary-res.cloudinary.com/image/upload/f_auto/q_auto/docs/focus_area_refiner.png "thumb: c_scale,w_500/dpr_2.0, width:500, popup: true")

You can either enter exact coordinates for the focus areas, or drag your mouse to select the desired region on the displayed image, which automatically populates the coordinates.
