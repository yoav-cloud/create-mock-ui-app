# Image resizing and cropping


[background-color-link]:effects_and_artistic_enhancements#setting_background_color
Responsive design and art direction generally requires displaying images  at a variety of sizes, often much smaller than the original.

If you deliver full size images and rely on browser-side resizing (using CSS or HTML width and height attributes), users are forced to download unnecessarily large files. Therefore, images  should always be delivered from the server at their final size.

When you use any of the Cloudinary [resizing transformations](transformation_reference#c_crop_resize), the sizing (scaling/cropping) is performed on the server side, and the asset is always delivered to the browser at the requested size.

Here are some examples of different cropping techniques used on the same image. Click each image to see the URL parameters applied in each case:

Original image

Focus on themodel in aportrait crop

Detect theface for athumbnail crop

Automatically determine what to keep in a banner crop

> **TIP**:
>
> :title=Tips:

> * To help you learn about the different cropping and resizing modes, try out the [interactive demo](#resizing_and_cropping_interactive_demo).

> * Resizing images can lead to a reduction in image quality. Cloudinary provides solutions for both [upscaling](#upscaling_with_super_resolution) and [downscaling](#downscaling_tips) to help retain the details in your images.
## Resize dimensions {anchor:setting_the_resize_dimensions}

You can set the target dimensions of your resized image by specifying width, height, and/or the target aspect ratio as qualifiers of your resize transformation.

* Using an integer value for [w (width)](transformation_reference#w_width) or [h (height)](transformation_reference#h_height) sets the new dimension to that number in pixels. For example, `w_150` sets the width to exactly 150 pixels.
* Using a decimal value for width or height sets the new dimension relative to the original dimension. For example, `w_0.5` sets the width to half the original width.
* Using `ih` or `iw` as values sets the dimension to the initial height or initial width of the original image respectively. For example, `w_iw` sets the width to the same value as the original width of the image. This may be useful when applying chained transformations or setting the dimensions of an [overlay](cloudinary_glossary#overlay). 
* Aspect ratios are specified using the [ar (aspect ratio)](transformation_reference#ar_aspect_ratio) parameter, as follows: 
    * `a:b` where `a` signifies the relative width and `b` the relative height (e.g., `ar_4:3` or `ar_16:9`).
    * a decimal value representing the ratio of the width divided by the height (e.g., `ar_1.33` or `ar_2.5`). 1.0 is a perfect square.
* In most cases, you will specify both width and height or width/height along with an aspect ratio to define the exact required dimensions. However, in rare cases, you may choose to specify only one of these 3 resize qualifiers, and Cloudinary will automatically determine the missing dimension as follows:

  * **If you provide only width or only height**, then the other dimension is automatically calculated to deliver the original aspect ratio.  For example, if your original asset is 400\*600, then specifying `c_crop,w_200` is the same as specifying `c_crop,w_200,h_300`. Supported for all resize and crop modes.  
  * **If you provide only the aspect ratio**: 
      * If `ar` > 1, the original width is maintained and the height is cropped to deliver the requested ratio.
      * If `ar` **Cropping modes** | If the requested dimensions have a different aspect ratio than the original, these modes crop out part of the image.
[fill](#fill) | Resizes the image to fill the specified dimensions without distortion. The image may be cropped as a result.
[lfill](#lfill_limit_fill) | Same as `fill`, but only scales down the image.
[fill_pad](#fill_pad) | Same as `fill`, but avoids excessive cropping by adding padding when needed.  Supported only with [automatic cropping](#automatic_cropping_g_auto).
[crop](#crop) | Extracts a region of the specified dimensions from the original image without first resizing it.
[thumb](#thumb) | Creates a thumbnail of the image with the specified dimensions, based on a specified [gravity](#control_gravity).  Scaling may occur.  
[auto](#c_auto) | Automatically determines the best crop based on a specified [gravity](#control_gravity). Scaling may occur.
**Resize modes** | These modes adjust the size of the delivered image without cropping out any elements of the original image.
[scale](#scale)| Resizes the image to the specified dimensions without necessarily retaining the original aspect ratio.
[fit](#fit) | Resizes the image to fit inside the bounding box specified by the dimensions, maintaining the aspect ratio.
[limit](#limit) | Same as `fit`, but only scales down the image.
[mfit](#mfit_minimum_fit) | Same as `fit`, but only scales up the image.
[pad](#pad) | Resizes the image to fit inside the bounding box specified by the dimensions, maintaining the aspect ratio, and applies padding if the resized image does not fill the whole area.
[lpad](#lpad_limit_pad)| Same as `pad`, but only scales down the image.
[mpad](#mpad_minimum_pad) | Same as `pad`, but only scales up the image.
**Add-on resize and crop modes** | These modes adjust the size and/or crop the image using an add-on.
[imagga_scale](imagga_crop_and_scale_addon#smartly_scale_images) | Performs smart scaling, using the [Imagga Crop and Scale](imagga_crop_and_scale_addon) add-on.
[imagga_crop](imagga_crop_and_scale_addon#smartly_crop_images) | Performs smart cropping, using the [Imagga Crop and Scale](imagga_crop_and_scale_addon) add-on.

> **NOTE**: When creating dynamic delivery URLs, if you specify only the width and/or height parameters, but no cropping mode (no `c_<mode>`), the image is [scaled](#scale) to the new dimensions by default. However, there is no default cropping mode when using the Cloudinary SDK helper methods (see [Embedding images in web pages using SDKs](image_transformations#embedding_images_in_web_pages_using_sdks)), so a cropping mode must be explicitly set.

Some of the cropping modes keep only a certain part of the original image in the resulting image.  By default, the center of the image is kept in the crop, but this is not always ideal.  To keep the parts of the image that are important to you, you can use the [gravity](#control_gravity) parameter.  For example, you can specify to keep faces, text, or certain objects in the crop, or gravitate towards an [automatically determined](#automatic_cropping_g_auto) area of interest.  You can also guide the crop towards areas of your image defined by compass points, for example, `north` to keep the top part of the image, or `south_east` to keep the bottom-right part.  Additionally, if you know the coordinates of the area you want to keep, you can explicitly specify these.

### Resize and crop mode examples
The following examples show the same image resized to a width and height of 200 pixels, using different methods of resizing and cropping.

The original image is 640 x 427 pixels:

![Man with camera](https://res.cloudinary.com/demo/image/upload/docs/camera-640.jpg "with_code:false, with_url:false, width:640")

Resizing the image to 200 x 200 pixels, using [crop](#crop), [scale](#scale), [fill](#fill) and [pad](#pad) results in the following images:

c_crop,h_200,w_200

c_scale,h_200,w_200

c_fill,h_200,w_200

b_brown,c_pad,h_200,w_200

You could deliver the `c_fill` transformation shown above as follows:

![Man with camera](https://res.cloudinary.com/demo/image/upload/c_fill,h_200,w_200/docs/camera-640.jpg "with_image:false")

```nodejs
cloudinary.image("docs/camera-640.jpg", {height: 200, width: 200, crop: "fill"})
```

```react
new CloudinaryImage("docs/camera-640.jpg").resize(
  fill().width(200).height(200)
);
```

```vue
new CloudinaryImage("docs/camera-640.jpg").resize(
  fill().width(200).height(200)
);
```

```angular
new CloudinaryImage("docs/camera-640.jpg").resize(
  fill().width(200).height(200)
);
```

```js
new CloudinaryImage("docs/camera-640.jpg").resize(
  fill().width(200).height(200)
);
```

```python
CloudinaryImage("docs/camera-640.jpg").image(height=200, width=200, crop="fill")
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::fill()->width(200)
->height(200));
```

```java
cloudinary.url().transformation(new Transformation().height(200).width(200).crop("fill")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", height: 200, width: 200, crop: "fill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(200).Width(200).Crop("fill")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(200).setWidth(200).setCrop("fill")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(200).width(200).crop("fill")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.fill() { width(200)
 height(200) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {height: 200, width: 200, crop: "fill"})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg").resize(
  fill().width(200).height(200)
);
```

The following sections explain how each of the crop modes behave.  Where resolution does not affect the behavior of the mode, the higher resolution image, `camera.jpg` (1280 x 853 pixels), is used. Where resolution matters, you'll see the 640 x 427 version (`camera-640.jpg`), or 100 x 67 version (`camera-100.jpg`), being used.

> **TIP**: You can experiment with the various crop modes (in combination with different [dimensions](#setting_the_resize_dimensions) and [gravity settings](#control_gravity)) using the [interactive demo](#resizing_and_cropping_interactive_demo).
### fill

The `fill` cropping mode creates an image with the exact specified dimensions, without distorting the image. This option first scales up or down as much as needed to at least fill both of the specified dimensions. If the requested aspect ratio is different than the original, cropping will occur on the dimension that exceeds the requested size after scaling. You can specify which part of the original image you want to keep if cropping occurs, using the [gravity](#control_gravity) parameter (set to `center` by default).

**See full syntax**: [c_fill](transformation_reference#c_fill) in the _Transformation Reference_.
  
#### Example 1: Fill a specific area with an image

Fill a 250-pixel square with the camera image:

![Image filled to a width and height of 250 pixels](https://res.cloudinary.com/demo/image/upload/c_fill,h_250,w_250/docs/camera.jpg)

```nodejs
cloudinary.image("docs/camera.jpg", {height: 250, width: 250, crop: "fill"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(fill().width(250).height(250));
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(fill().width(250).height(250));
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(fill().width(250).height(250));
```

```js
new CloudinaryImage("docs/camera.jpg").resize(fill().width(250).height(250));
```

```python
CloudinaryImage("docs/camera.jpg").image(height=250, width=250, crop="fill")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::fill()->width(250)
->height(250));
```

```java
cloudinary.url().transformation(new Transformation().height(250).width(250).crop("fill")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", height: 250, width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(250).Width(250).Crop("fill")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(250).setWidth(250).setCrop("fill")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(250).width(250).crop("fill")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.fill() { width(250)
 height(250) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {height: 250, width: 250, crop: "fill"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(fill().width(250).height(250));
```

![Video filled to a width and height of 250 pixels](https://res.cloudinary.com/demo/video/upload/c_fill,h_250,w_250/cld_rubiks_guy.mp4)

```nodejs
cloudinary.video("cld_rubiks_guy", {height: 250, width: 250, crop: "fill"})
```

```react
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(fill().width(250).height(250));
```

```vue
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(fill().width(250).height(250));
```

```angular
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(fill().width(250).height(250));
```

```js
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(fill().width(250).height(250));
```

```python
CloudinaryVideo("cld_rubiks_guy").video(height=250, width=250, crop="fill")
```

```php
(new VideoTag('cld_rubiks_guy.mp4'))
	->resize(Resize::fill()->width(250)
->height(250));
```

```java
cloudinary.url().transformation(new Transformation().height(250).width(250).crop("fill")).videoTag("cld_rubiks_guy");
```

```ruby
cl_video_tag("cld_rubiks_guy", height: 250, width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Height(250).Width(250).Crop("fill")).BuildVideoTag("cld_rubiks_guy")
```

```dart
cloudinary.video('cld_rubiks_guy.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setHeight(250).setWidth(250).setCrop("fill")).generate("cld_rubiks_guy.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().height(250).width(250).crop("fill")).resourceType("video").generate("cld_rubiks_guy.mp4");
```

```flutter
cloudinary.video('cld_rubiks_guy.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)));
```

```kotlin
cloudinary.video {
	publicId("cld_rubiks_guy.mp4")
	 resize(Resize.fill() { width(250)
 height(250) }) 
}.generate()
```

```jquery
$.cloudinary.video("cld_rubiks_guy", {height: 250, width: 250, crop: "fill"})
```

```react_native
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(fill().width(250).height(250));
```

#### Example 2: Fill a specific area with a specific part of an image

Fill a 250-pixel square with the top-right part (gravity northeast) of the camera image:

![Image filled to a width and height of 250 pixels with northeast gravity](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,g_north_east,w_250/docs/camera.jpg)

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", gravity: "north_east", width: 250, crop: "fill"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="1.0", gravity="north_east", width=250, crop="fill")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::fill()->width(250)
->aspectRatio(1.0)
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").gravity("north_east").width(250).crop("fill")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "1.0", gravity: "north_east", width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.0").Gravity("north_east").Width(250).Crop("fill")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.aspectRatio('1.0')
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.0").setGravity("north_east").setWidth(250).setCrop("fill")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").gravity("north_east").width(250).crop("fill")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.aspectRatio('1.0')
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.fill() { width(250)
 aspectRatio(1.0F)
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", gravity: "north_east", width: 250, crop: "fill"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

![Video filled to a width and height of 250 pixels with northeast gravity](https://res.cloudinary.com/demo/video/upload/ar_1.0,c_fill,g_north_east,w_250/cld_rubiks_guy.mp4)

```nodejs
cloudinary.video("cld_rubiks_guy", {aspect_ratio: "1.0", gravity: "north_east", width: 250, crop: "fill"})
```

```react
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```vue
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```angular
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```js
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```

```python
CloudinaryVideo("cld_rubiks_guy").video(aspect_ratio="1.0", gravity="north_east", width=250, crop="fill")
```

```php
(new VideoTag('cld_rubiks_guy.mp4'))
	->resize(Resize::fill()->width(250)
->aspectRatio(1.0)
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").gravity("north_east").width(250).crop("fill")).videoTag("cld_rubiks_guy");
```

```ruby
cl_video_tag("cld_rubiks_guy", aspect_ratio: "1.0", gravity: "north_east", width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().AspectRatio("1.0").Gravity("north_east").Width(250).Crop("fill")).BuildVideoTag("cld_rubiks_guy")
```

```dart
cloudinary.video('cld_rubiks_guy.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.aspectRatio('1.0')
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setAspectRatio("1.0").setGravity("north_east").setWidth(250).setCrop("fill")).generate("cld_rubiks_guy.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").gravity("north_east").width(250).crop("fill")).resourceType("video").generate("cld_rubiks_guy.mp4");
```

```flutter
cloudinary.video('cld_rubiks_guy.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.aspectRatio('1.0')
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	));
```

```kotlin
cloudinary.video {
	publicId("cld_rubiks_guy.mp4")
	 resize(Resize.fill() { width(250)
 aspectRatio(1.0F)
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("cld_rubiks_guy", {aspect_ratio: "1.0", gravity: "north_east", width: 250, crop: "fill"})
```

```react_native
new CloudinaryVideo("cld_rubiks_guy.mp4").resize(
  fill()
    .width(250)
    .aspectRatio("1.0")
    .gravity(compass("north_east"))
);
```
### lfill (limit fill)

The `lfill` cropping mode behaves the same as the `fill` mode, but only if the original image is larger than the specified resolution limits, in which case the image is scaled down to fill the specified dimensions without distorting the image, and then the dimension that exceeds the request is cropped. If the original dimensions are smaller than the requested size, it is not resized at all. This prevents upscaling. You can specify which part of the original image you want to keep if cropping occurs using the [gravity](#control_gravity) parameter (set to `center` by default).

**See full syntax**: [c_lfill](transformation_reference#c_lfill) in the _Transformation Reference_.

#### Example 1: Scale down and fill an area defined by width and height

Fill a 150 x 200 pixel area with the `camera` image and limiting the size to no larger than the original image:

![Image lfilled to a width of 150 and a height of 200 pixels](https://res.cloudinary.com/demo/image/upload/c_lfill,h_200,w_150/docs/camera.jpg "width:150")

```nodejs
cloudinary.image("docs/camera.jpg", {height: 200, width: 150, crop: "lfill"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().width(150).height(200)
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().width(150).height(200)
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().width(150).height(200)
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().width(150).height(200)
);
```

```python
CloudinaryImage("docs/camera.jpg").image(height=200, width=150, crop="lfill")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::limitFill()->width(150)
->height(200));
```

```java
cloudinary.url().transformation(new Transformation().height(200).width(150).crop("lfill")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", height: 200, width: 150, crop: "lfill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(200).Width(150).Crop("lfill")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFill().width(150)
.height(200)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(200).setWidth(150).setCrop("lfill")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(200).width(150).crop("lfill")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFill().width(150)
.height(200)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.limitFill() { width(150)
 height(200) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {height: 200, width: 150, crop: "lfill"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().width(150).height(200)
);
```

#### Example 2: Scale down and fill an area defined by aspect ratio and height

Scale down the `camera` image to fill a 200-pixel square defined by aspect ratio and height:

![Image lfilled to a height of 200 pixels and aspect ratio 1.0](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_lfill,h_200/docs/camera.jpg "width:200")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", height: 200, crop: "lfill"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().height(200).aspectRatio("1.0")
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().height(200).aspectRatio("1.0")
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().height(200).aspectRatio("1.0")
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().height(200).aspectRatio("1.0")
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="1.0", height=200, crop="lfill")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::limitFill()->height(200)
->aspectRatio(1.0));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").height(200).crop("lfill")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "1.0", height: 200, crop: "lfill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.0").Height(200).Crop("lfill")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFill().height(200)
.aspectRatio('1.0')));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.0").setHeight(200).setCrop("lfill")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").height(200).crop("lfill")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFill().height(200)
.aspectRatio('1.0')));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.limitFill() { height(200)
 aspectRatio(1.0F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", height: 200, crop: "lfill"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  limitFill().height(200).aspectRatio("1.0")
);
```

### fill_pad

The `fill_pad` cropping mode tries to prevent a "bad crop" by first attempting to use the `fill` mode, but adds padding if it is determined that more of the original image needs to be included in the final image. This is especially useful if the aspect ratio of the delivered image is considerably different from the original's aspect ratio. It is only supported in conjunction with [Automatic cropping](#automatic_cropping_g_auto) (g_auto), and not supported for [animated images](animated_images).

**See full syntax**: [c_fill_pad](transformation_reference#c_fill_pad) in the _Transformation Reference_.

#### Example: Compare standard fill mode with fill_pad mode

Compare the `camera` image delivered as an 80 x 400 image using the `fill` mode on the left, with the `fill_pad` mode on the right:
  

fill

fill_pad

![fill_pad](https://res.cloudinary.com/demo/image/upload/b_auto,c_fill_pad,g_auto,h_400,w_80/docs/camera.jpg "with_image: false, width:80")

```nodejs
cloudinary.image("docs/camera.jpg", {background: "auto", gravity: "auto", height: 400, width: 80, crop: "fill_pad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  fillPad()
    .width(80)
    .height(400)
    .gravity(autoGravity())
    .background(auto())
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  fillPad()
    .width(80)
    .height(400)
    .gravity(autoGravity())
    .background(auto())
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  fillPad()
    .width(80)
    .height(400)
    .gravity(autoGravity())
    .background(auto())
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  fillPad()
    .width(80)
    .height(400)
    .gravity(autoGravity())
    .background(auto())
);
```

```python
CloudinaryImage("docs/camera.jpg").image(background="auto", gravity="auto", height=400, width=80, crop="fill_pad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::fillPad()->width(80)
->height(400)
	->gravity(
	Gravity::autoGravity())
	->background(
	Background::auto())
	);
```

```java
cloudinary.url().transformation(new Transformation().background("auto").gravity("auto").height(400).width(80).crop("fill_pad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", background: "auto", gravity: "auto", height: 400, width: 80, crop: "fill_pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("auto").Gravity("auto").Height(400).Width(80).Crop("fill_pad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fillPad().width(80)
.height(400)
	.gravity(
	Gravity.autoGravity())
	.background(
	Background.auto())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("auto").setGravity("auto").setHeight(400).setWidth(80).setCrop("fill_pad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("auto").gravity("auto").height(400).width(80).crop("fill_pad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fillPad().width(80)
.height(400)
	.gravity(
	Gravity.autoGravity())
	.background(
	Background.auto())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.fillPad() { width(80)
 height(400)
	 gravity(
	Gravity.autoGravity())
	 background(
	Background.auto())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {background: "auto", gravity: "auto", height: 400, width: 80, crop: "fill_pad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  fillPad()
    .width(80)
    .height(400)
    .gravity(autoGravity())
    .background(auto())
);
```

### crop

The `crop` cropping mode extracts a region of the specified dimensions or a detected object from the original image. No scaling is applied, so if you specify dimensions, applying the `crop` mode to the same image of different resolutions can provide very different results. You can specify the [gravity](#control_gravity) parameter to select which area or object to extract, or use [fixed coordinates cropping](#fixed_coordinates_cropping).

**See full syntax**: [c_crop](transformation_reference#c_crop) in the _Transformation Reference_.

> **NOTE**: The following examples use the `camera-640` image, which is a 640 pixel wide version of the camera image. If you replace the public ID with `camera` (1280 pixels wide), you'll see how the resulting image differs based on the resolution.

#### Example 1: Crop an image to specified dimensions (width and height)

Crop the `camera-640` image to a width of 200 pixels and a height of 250 pixels, with northeast gravity:

![Image cropped to 200x250 with northeast gravity](https://res.cloudinary.com/demo/image/upload/c_crop,g_north_east,h_250,w_200/docs/camera-640.jpg)

```nodejs
cloudinary.image("docs/camera-640.jpg", {gravity: "north_east", height: 250, width: 200, crop: "crop"})
```

```react
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(compass("north_east"))
);
```

```vue
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(compass("north_east"))
);
```

```angular
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(compass("north_east"))
);
```

```js
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(compass("north_east"))
);
```

```python
CloudinaryImage("docs/camera-640.jpg").image(gravity="north_east", height=250, width=200, crop="crop")
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::crop()->width(200)
->height(250)
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("north_east").height(250).width(200).crop("crop")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", gravity: "north_east", height: 250, width: 200, crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("north_east").Height(250).Width(200).Crop("crop")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(200)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("north_east").setHeight(250).setWidth(200).setCrop("crop")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("north_east").height(250).width(200).crop("crop")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(200)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.crop() { width(200)
 height(250)
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {gravity: "north_east", height: 250, width: 200, crop: "crop"})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(compass("north_east"))
);
```

#### Example 2: Crop an image to specified dimensions (aspect ratio and width)

Crop the `camera-640` image to a width of 450 pixels and an aspect ratio of 1.5:

![Image cropped to 450 width with aspect ratio of 1.5](https://res.cloudinary.com/demo/image/upload/ar_1.5,c_crop,w_450/docs/camera-640.jpg "width:450")

```nodejs
cloudinary.image("docs/camera-640.jpg", {aspect_ratio: "1.5", width: 450, crop: "crop"})
```

```react
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(450).aspectRatio(1.5)
);
```

```vue
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(450).aspectRatio(1.5)
);
```

```angular
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(450).aspectRatio(1.5)
);
```

```js
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(450).aspectRatio(1.5)
);
```

```python
CloudinaryImage("docs/camera-640.jpg").image(aspect_ratio="1.5", width=450, crop="crop")
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::crop()->width(450)
->aspectRatio(1.5));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.5").width(450).crop("crop")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", aspect_ratio: "1.5", width: 450, crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.5").Width(450).Crop("crop")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(450)
.aspectRatio(1.5)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.5").setWidth(450).setCrop("crop")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.5").width(450).crop("crop")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(450)
.aspectRatio(1.5)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.crop() { width(450)
 aspectRatio(1.5F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {aspect_ratio: "1.5", width: 450, crop: "crop"})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(450).aspectRatio(1.5)
);
```

#### Example 3: Crop an image to keep only the face

Crop the `camera-640` image without specifying dimensions, to keep only the face.

![Image cropped to a face](https://res.cloudinary.com/demo/image/upload/c_crop,g_face/docs/camera-640.jpg "width:140")

```nodejs
cloudinary.image("docs/camera-640.jpg", {gravity: "face", crop: "crop"})
```

```react
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```vue
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```angular
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```js
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

```python
CloudinaryImage("docs/camera-640.jpg").image(gravity="face", crop="crop")
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::crop()
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("face").crop("crop")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", gravity: "face", crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("face").Crop("crop")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop()
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("face").setCrop("crop")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("face").crop("crop")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop()
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.crop() {
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {gravity: "face", crop: "crop"})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().gravity(focusOn(face()))
);
```

#### Example 4: Crop an image to keep only the largest image in a composition

Use the `cld-decompose_tile` [special gravity position](#special_positions) to crop an image composed of many images, such as this, keeping only the largest "tile":

![Image of several bird tiles](https://res.cloudinary.com/demo/image/upload/docs/tiled-birds.jpg "thumb: w_440, with_url: false, with_code: false, width:440")

![Crop to the largest tile](https://res.cloudinary.com/demo/image/upload/c_crop,g_cld-decompose_tile/docs/tiled-birds.jpg "thumb: w_275, width:275")

```nodejs
cloudinary.image("docs/tiled-birds.jpg", {gravity: "cld-decompose_tile", crop: "crop"})
```

```react
new CloudinaryImage("docs/tiled-birds.jpg").resize(
  crop().gravity(focusOn("cld-decompose_tile"))
);
```

```vue
new CloudinaryImage("docs/tiled-birds.jpg").resize(
  crop().gravity(focusOn("cld-decompose_tile"))
);
```

```angular
new CloudinaryImage("docs/tiled-birds.jpg").resize(
  crop().gravity(focusOn("cld-decompose_tile"))
);
```

```js
new CloudinaryImage("docs/tiled-birds.jpg").resize(
  crop().gravity(focusOn("cld-decompose_tile"))
);
```

```python
CloudinaryImage("docs/tiled-birds.jpg").image(gravity="cld-decompose_tile", crop="crop")
```

```php
(new ImageTag('docs/tiled-birds.jpg'))
	->resize(Resize::crop()
	->gravity(
	Gravity::focusOn("cld-decompose_tile"))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("cld-decompose_tile").crop("crop")).imageTag("docs/tiled-birds.jpg");
```

```ruby
cl_image_tag("docs/tiled-birds.jpg", gravity: "cld-decompose_tile", crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("cld-decompose_tile").Crop("crop")).BuildImageTag("docs/tiled-birds.jpg")
```

```dart
cloudinary.image('docs/tiled-birds.jpg').transformation(Transformation()
	.resize(Resize.crop()
	.gravity(
	Gravity.focusOn("cld-decompose_tile"))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("cld-decompose_tile").setCrop("crop")).generate("docs/tiled-birds.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("cld-decompose_tile").crop("crop")).generate("docs/tiled-birds.jpg");
```

```flutter
cloudinary.image('docs/tiled-birds.jpg').transformation(Transformation()
	.resize(Resize.crop()
	.gravity(
	Gravity.focusOn("cld-decompose_tile"))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/tiled-birds.jpg")
	 resize(Resize.crop() {
	 gravity(
	Gravity.focusOn("cld-decompose_tile"))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/tiled-birds.jpg", {gravity: "cld-decompose_tile", crop: "crop"})
```

```react_native
new CloudinaryImage("docs/tiled-birds.jpg").resize(
  crop().gravity(focusOn("cld-decompose_tile"))
);
```

#### Fixed coordinates cropping

You can specify a region of the original image to crop by giving the `x` and `y` coordinates of the top left corner of the region together with the `width` and `height` of the region. You can also use percentage based numbers instead of the exact coordinates for `x`, `y`, `w` and `h` (e.g., 0.5 for 50%) - in this case all four parameters must be percentage based. 

Use this method when you know beforehand what the correct absolute cropping coordinates are, as in when your users manually select the region to crop out of the original image. 

For example, here's the full `camera-640` image (640 x 427 px). 

![Original camera image](https://res.cloudinary.com/demo/image/upload/docs/camera-640.jpg  "width:640")

```nodejs
cloudinary.image("docs/camera-640.jpg")
```

```react
new CloudinaryImage("docs/camera-640.jpg");
```

```vue
new CloudinaryImage("docs/camera-640.jpg");
```

```angular
new CloudinaryImage("docs/camera-640.jpg");
```

```js
new CloudinaryImage("docs/camera-640.jpg");
```

```python
CloudinaryImage("docs/camera-640.jpg").image()
```

```php
(new ImageTag('docs/camera-640.jpg'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg") 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg")
```

```react_native
new CloudinaryImage("docs/camera-640.jpg");
```

To resize the picture so that only the camera is visible, the image is cropped to a 300x170 region starting at the coordinate x = 170 and y = 40:

![300x170 image generated with fixed-coordinates cropping](https://res.cloudinary.com/demo/image/upload/c_crop,h_200,w_300,x_170,y_40/docs/camera-640.jpg "width:300")

```nodejs
cloudinary.image("docs/camera-640.jpg", {height: 200, width: 300, x: 170, y: 40, crop: "crop"})
```

```react
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(300).height(200).x(170).y(40)
);
```

```vue
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(300).height(200).x(170).y(40)
);
```

```angular
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(300).height(200).x(170).y(40)
);
```

```js
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(300).height(200).x(170).y(40)
);
```

```python
CloudinaryImage("docs/camera-640.jpg").image(height=200, width=300, x=170, y=40, crop="crop")
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::crop()->width(300)
->height(200)
->x(170)
->y(40));
```

```java
cloudinary.url().transformation(new Transformation().height(200).width(300).x(170).y(40).crop("crop")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", height: 200, width: 300, x: 170, y: 40, crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(200).Width(300).X(170).Y(40).Crop("crop")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(300)
.height(200)
.x(170)
.y(40)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(200).setWidth(300).setX(170).setY(40).setCrop("crop")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(200).width(300).x(170).y(40).crop("crop")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(300)
.height(200)
.x(170)
.y(40)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.crop() { width(300)
 height(200)
 x(170)
 y(40) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {height: 200, width: 300, x: 170, y: 40, crop: "crop"})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg").resize(
  crop().width(300).height(200).x(170).y(40)
);
```

The image can be further resized with [chained transformations](image_transformations#chained_transformations). For example, the 300x170 cropped version above, also scaled down to half that size:

![fixed-coordinates cropped image also scaled down](https://res.cloudinary.com/demo/image/upload/c_crop,h_170,w_300,x_170,y_40/c_scale,w_0.5/docs/camera-640.jpg "width:150")

```nodejs
cloudinary.image("docs/camera-640.jpg", {transformation: [
  {height: 170, width: 300, x: 170, y: 40, crop: "crop"},
  {width: "0.5", crop: "scale"}
  ]})
```

```react
new CloudinaryImage("docs/camera-640.jpg")
  .resize(crop().width(300).height(170).x(170).y(40))
  .resize(scale().width(0.5));
```

```vue
new CloudinaryImage("docs/camera-640.jpg")
  .resize(crop().width(300).height(170).x(170).y(40))
  .resize(scale().width(0.5));
```

```angular
new CloudinaryImage("docs/camera-640.jpg")
  .resize(crop().width(300).height(170).x(170).y(40))
  .resize(scale().width(0.5));
```

```js
new CloudinaryImage("docs/camera-640.jpg")
  .resize(crop().width(300).height(170).x(170).y(40))
  .resize(scale().width(0.5));
```

```python
CloudinaryImage("docs/camera-640.jpg").image(transformation=[
  {'height': 170, 'width': 300, 'x': 170, 'y': 40, 'crop': "crop"},
  {'width': "0.5", 'crop': "scale"}
  ])
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::crop()->width(300)
->height(170)
->x(170)
->y(40))
	->resize(Resize::scale()->width(0.5));
```

```java
cloudinary.url().transformation(new Transformation()
  .height(170).width(300).x(170).y(40).crop("crop").chain()
  .width(0.5).crop("scale")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", transformation: [
  {height: 170, width: 300, x: 170, y: 40, crop: "crop"},
  {width: 0.5, crop: "scale"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(170).Width(300).X(170).Y(40).Crop("crop").Chain()
  .Width(0.5).Crop("scale")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(300)
.height(170)
.x(170)
.y(40))
	.resize(Resize.scale().width(0.5)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setHeight(170).setWidth(300).setX(170).setY(40).setCrop("crop").chain()
  .setWidth(0.5).setCrop("scale")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(170).width(300).x(170).y(40).crop("crop").chain()
  .width(0.5).crop("scale")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.crop().width(300)
.height(170)
.x(170)
.y(40))
	.resize(Resize.scale().width(0.5)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.crop() { width(300)
 height(170)
 x(170)
 y(40) })
	 resize(Resize.scale() { width(0.5F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {transformation: [
  {height: 170, width: 300, x: 170, y: 40, crop: "crop"},
  {width: "0.5", crop: "scale"}
  ]})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg")
  .resize(crop().width(300).height(170).x(170).y(40))
  .resize(scale().width(0.5));
```

> **TIP**: If you're looking to crop images to focus on certain objects, try the [Cloudinary AI Content Analysis add-on](cloudinary_ai_content_analysis_addon).

### thumb

The `thumb` cropping mode is specifically used for creating image thumbnails and must always be accompanied by the [gravity](#control_gravity) parameter. This cropping mode generates a thumbnail of an image with the exact specified dimensions and with the original proportions retained, but the resulting image might be scaled to fit in the specified dimensions. You can specify the [zoom](face_detection_based_transformations#zoom_level) parameter to determine how much to scale the resulting image within the specified dimensions.

**See full syntax**: [c_thumb](transformation_reference#c_thumb) in the _Transformation Reference_.

#### Example 1: Crop to a thumbnail of a face

Create a 150 x 150 thumbnail with face detection, of the `camera` image. Below you can see the original image as well as the face detection based thumbnail:

![Original photo for face detection](https://res.cloudinary.com/demo/image/upload/docs/camera.jpg "with_code: false, thumb: w_300, width:300")

![150x150 thumbnail with face detection](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_150,w_150/docs/camera.jpg "width:150")

```nodejs
cloudinary.image("docs/camera.jpg", {gravity: "face", height: 150, width: 150, crop: "thumb"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .width(150)
    .height(150)
    .gravity(focusOn(face()))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .width(150)
    .height(150)
    .gravity(focusOn(face()))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .width(150)
    .height(150)
    .gravity(focusOn(face()))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .width(150)
    .height(150)
    .gravity(focusOn(face()))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(gravity="face", height=150, width=150, crop="thumb")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::thumbnail()->width(150)
->height(150)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("face").height(150).width(150).crop("thumb")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", gravity: "face", height: 150, width: 150, crop: "thumb")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("face").Height(150).Width(150).Crop("thumb")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.thumbnail().width(150)
.height(150)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("face").setHeight(150).setWidth(150).setCrop("thumb")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("face").height(150).width(150).crop("thumb")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.thumbnail().width(150)
.height(150)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.thumbnail() { width(150)
 height(150)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {gravity: "face", height: 150, width: 150, crop: "thumb"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .width(150)
    .height(150)
    .gravity(focusOn(face()))
);
```

#### Example 2: Crop to a thumbnail of a face using aspect ratio and zoom

Create a 150-pixel high thumbnail with aspect ratio 5:6 and face detection of the `camera` image, zoomed out by 75%.

![150-pixel high thumbnail with face detection zoomed out](https://res.cloudinary.com/demo/image/upload/ar_5:6,c_thumb,g_face,h_150,z_0.75/docs/camera.jpg "width:125")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "5:6", gravity: "face", height: 150, zoom: "0.75", crop: "thumb"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .height(150)
    .aspectRatio("5:6")
    .zoom(0.75)
    .gravity(focusOn(face()))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .height(150)
    .aspectRatio("5:6")
    .zoom(0.75)
    .gravity(focusOn(face()))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .height(150)
    .aspectRatio("5:6")
    .zoom(0.75)
    .gravity(focusOn(face()))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .height(150)
    .aspectRatio("5:6")
    .zoom(0.75)
    .gravity(focusOn(face()))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="5:6", gravity="face", height=150, zoom="0.75", crop="thumb")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::thumbnail()->height(150)
->aspectRatio("5:6")
->zoom(0.75)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("5:6").gravity("face").height(150).zoom(0.75).crop("thumb")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "5:6", gravity: "face", height: 150, zoom: 0.75, crop: "thumb")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("5:6").Gravity("face").Height(150).Zoom(0.75).Crop("thumb")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.thumbnail().height(150)
.aspectRatio("5:6")
.zoom(0.75)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("5:6").setGravity("face").setHeight(150).setZoom(0.75).setCrop("thumb")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("5:6").gravity("face").height(150).zoom(0.75).crop("thumb")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.thumbnail().height(150)
.aspectRatio("5:6")
.zoom(0.75)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.thumbnail() { height(150)
 aspectRatio("5:6")
 zoom(0.75F)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "5:6", gravity: "face", height: 150, zoom: "0.75", crop: "thumb"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  thumbnail()
    .height(150)
    .aspectRatio("5:6")
    .zoom(0.75)
    .gravity(focusOn(face()))
);
```

### auto
The `auto` cropping mode automatically determines the best crop based on the gravity and specified dimensions. It is less aggressive than [thumb](#thumb) and provides more focus than [fill](#fill). If the requested dimensions are smaller than the best crop, the result is downscaled. If the requested dimensions are larger than the original image, the result is upscaled. Use this mode in conjunction with the [gravity](#control_gravity) parameter, in particular [automatic gravity](#automatic_gravity_with_the_auto_cropping_mode) and with [object aware cropping](cloudinary_ai_content_analysis_addon#object_aware_cropping).

**See full syntax**: [c_auto](transformation_reference#c_auto) in the _Transformation Reference_.

**Try it out**: [Content-aware cropping](https://console.cloudinary.com/app/image/home/smart-crop?media=image&collection=image&sample=me%2Fsmart-crop-1.jpg&variant=left).

#### Example 1: Automatically crop to the most interesting part of the image (width and height)

Create a 300 x 350 crop of an image, automatically deciding which parts of the image to keep.

![Man holding a camera](https://res.cloudinary.com/demo/image/upload/c_auto,g_auto,h_350,w_300/docs/camera.jpg "width:300")

```nodejs
cloudinary.image("docs/camera.jpg", {gravity: "auto", height: 350, width: 300, crop: "auto"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(300)
    .height(350)
    .gravity(autoGravity())
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(300)
    .height(350)
    .gravity(autoGravity())
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(300)
    .height(350)
    .gravity(autoGravity())
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(300)
    .height(350)
    .gravity(autoGravity())
);
```

```python
CloudinaryImage("docs/camera.jpg").image(gravity="auto", height=350, width=300, crop="auto")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::auto()->width(300)
->height(350)
	->gravity(
	Gravity::autoGravity())
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto").height(350).width(300).crop("auto")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", gravity: "auto", height: 350, width: 300, crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto").Height(350).Width(300).Crop("auto")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.auto().width(300)
.height(350)
	.gravity(
	Gravity.autoGravity())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto").setHeight(350).setWidth(300).setCrop("auto")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto").height(350).width(300).crop("auto")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.auto().width(300)
.height(350)
	.gravity(
	Gravity.autoGravity())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.auto() { width(300)
 height(350)
	 gravity(
	Gravity.autoGravity())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {gravity: "auto", height: 350, width: 300, crop: "auto"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(300)
    .height(350)
    .gravity(autoGravity())
);
```

#### Example 2: Automatically crop to the camera (width and aspect ratio)

Create a 16:9 aspect ratio crop of an image, keeping focus on the camera (requires the [Cloudinary AI Content Analysis add-on](cloudinary_ai_content_analysis_addon#object_aware_cropping)).

![Man holding a camera](https://res.cloudinary.com/demo/image/upload/ar_16:9,c_auto,g_auto:camera,w_450/docs/camera.jpg "width:450")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "16:9", gravity: "auto:camera", width: 450, crop: "auto"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(450)
    .aspectRatio(ar16X9())
    .gravity(autoGravity().autoFocus(focusOn("camera")))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(450)
    .aspectRatio(ar16X9())
    .gravity(autoGravity().autoFocus(focusOn("camera")))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(450)
    .aspectRatio(ar16X9())
    .gravity(autoGravity().autoFocus(focusOn("camera")))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(450)
    .aspectRatio(ar16X9())
    .gravity(autoGravity().autoFocus(focusOn("camera")))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="16:9", gravity="auto:camera", width=450, crop="auto")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::auto()->width(450)
	->aspectRatio(
	AspectRatio::ar16X9())
	->gravity(
	Gravity::autoGravity()
	->autoFocus(
	AutoFocus::focusOn("camera"))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("16:9").gravity("auto:camera").width(450).crop("auto")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "16:9", gravity: "auto:camera", width: 450, crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("16:9").Gravity("auto:camera").Width(450).Crop("auto")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.auto().width(450)
	.aspectRatio(
	AspectRatio.ar16X9())
	.gravity(
	Gravity.autoGravity()
	.autoFocus(
	AutoFocus.focusOn("camera"))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("16:9").setGravity("auto:camera").setWidth(450).setCrop("auto")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("16:9").gravity("auto:camera").width(450).crop("auto")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.auto().width(450)
	.aspectRatio(
	AspectRatio.ar16X9())
	.gravity(
	Gravity.autoGravity()
	.autoFocus(
	AutoFocus.focusOn("camera"))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.auto() { width(450)
	 aspectRatio(
	AspectRatio.ar16X9())
	 gravity(
	Gravity.autoGravity() {
	 autoFocus(
	AutoFocus.focusOn("camera"))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "16:9", gravity: "auto:camera", width: 450, crop: "auto"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  auto()
    .width(450)
    .aspectRatio(ar16X9())
    .gravity(autoGravity().autoFocus(focusOn("camera")))
);
```

**See also**: [Automatic gravity with the auto cropping mode](#automatic_gravity_with_the_auto_cropping_mode)

### auto_pad

The `auto_pad` cropping mode tries to prevent a "bad crop" by first attempting to use the `auto` mode, but adds padding if it is determined that more of the original image needs to be included in the final image. This is especially useful if the aspect ratio of the delivered image is considerably different from the original's aspect ratio. It is only supported in conjunction with [Automatic cropping](#automatic_cropping_g_auto) (g_auto), and not supported for [animated images](animated_images).

**See full syntax**: [c_auto_pad](transformation_reference#c_auto_pad) in the _Transformation Reference_.

#### Example 1: Compare standard auto cropping mode with auto_pad mode

Compare the following image delivered as a 110 x 300 image using the `auto` mode on the left, with the `auto_pad` mode on the right:
  

auto

auto_pad  

![auto_pad](https://res.cloudinary.com/demo/image/upload/b_auto,c_auto_pad,g_auto,h_300,w_110/docs/camera.jpg "with_image: false, width:110")

```nodejs
cloudinary.image("docs/camera.jpg", {background: "auto", gravity: "auto", height: 300, width: 110, crop: "auto_pad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(auto())
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(auto())
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(auto())
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(auto())
);
```

```python
CloudinaryImage("docs/camera.jpg").image(background="auto", gravity="auto", height=300, width=110, crop="auto_pad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::autoPad()->width(110)
->height(300)
	->gravity(
	Gravity::autoGravity())
	->background(
	Background::auto())
	);
```

```java
cloudinary.url().transformation(new Transformation().background("auto").gravity("auto").height(300).width(110).crop("auto_pad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", background: "auto", gravity: "auto", height: 300, width: 110, crop: "auto_pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("auto").Gravity("auto").Height(300).Width(110).Crop("auto_pad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.autoPad().width(110)
.height(300)
	.gravity(
	Gravity.autoGravity())
	.background(
	Background.auto())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("auto").setGravity("auto").setHeight(300).setWidth(110).setCrop("auto_pad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("auto").gravity("auto").height(300).width(110).crop("auto_pad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.autoPad().width(110)
.height(300)
	.gravity(
	Gravity.autoGravity())
	.background(
	Background.auto())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.autoPad() { width(110)
 height(300)
	 gravity(
	Gravity.autoGravity())
	 background(
	Background.auto())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {background: "auto", gravity: "auto", height: 300, width: 110, crop: "auto_pad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(auto())
);
```

#### Example 2: Use auto_pad mode with auto_fill background

Rather than use a solid color to pad the background, use generative fill:

![Image padded with generative fill](https://res.cloudinary.com/demo/image/upload/b_gen_fill,c_auto_pad,g_auto,h_300,w_110/docs/camera.jpg "width:110")

```nodejs
cloudinary.image("docs/camera.jpg", {background: "gen_fill", gravity: "auto", height: 300, width: 110, crop: "auto_pad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(generativeFill())
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(generativeFill())
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(generativeFill())
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(generativeFill())
);
```

```python
CloudinaryImage("docs/camera.jpg").image(background="gen_fill", gravity="auto", height=300, width=110, crop="auto_pad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::autoPad()->width(110)
->height(300)
	->gravity(
	Gravity::autoGravity())
	->background(
	Background::generativeFill())
	);
```

```java
cloudinary.url().transformation(new Transformation().background("gen_fill").gravity("auto").height(300).width(110).crop("auto_pad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", background: "gen_fill", gravity: "auto", height: 300, width: 110, crop: "auto_pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("gen_fill").Gravity("auto").Height(300).Width(110).Crop("auto_pad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.autoPad().width(110)
.height(300)
	.gravity(
	Gravity.autoGravity())
	.background(
	Background.generativeFill())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("gen_fill").setGravity("auto").setHeight(300).setWidth(110).setCrop("auto_pad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("gen_fill").gravity("auto").height(300).width(110).crop("auto_pad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.autoPad().width(110)
.height(300)
	.gravity(
	Gravity.autoGravity())
	.background(
	Background.generativeFill())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.autoPad() { width(110)
 height(300)
	 gravity(
	Gravity.autoGravity())
	 background(
	Background.generativeFill())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {background: "gen_fill", gravity: "auto", height: 300, width: 110, crop: "auto_pad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  autoPad()
    .width(110)
    .height(300)
    .gravity(autoGravity())
    .background(generativeFill())
);
```
### scale

The `scale` resize mode changes the size of the image exactly to the specified dimensions without necessarily retaining the original aspect ratio: all original image parts are visible but might be stretched or shrunk. If only the width or height is specified, then the image is scaled to the new dimension while retaining the original aspect ratio, unless you also include the [ignore_aspect_ratio](transformation_reference#fl_ignore_aspect_ratio) flag.

**See full syntax**: [c_scale](transformation_reference#c_scale) in the _Transformation Reference_.
  
#### Example 1: Scale while maintaining aspect ratio 

Scale the camera image to a width of 150 pixels (maintains the aspect ratio by default):

![Image scaled to a width of 150 pixels](https://res.cloudinary.com/demo/image/upload/c_scale,w_150/docs/camera.jpg "width:150")

```nodejs
cloudinary.image("docs/camera.jpg", {width: 150, crop: "scale"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150));
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150));
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150));
```

```js
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150));
```

```python
CloudinaryImage("docs/camera.jpg").image(width=150, crop="scale")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::scale()->width(150));
```

```java
cloudinary.url().transformation(new Transformation().width(150).crop("scale")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", width: 150, crop: "scale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Width(150).Crop("scale")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(150)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setWidth(150).setCrop("scale")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().width(150).crop("scale")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(150)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.scale() { width(150) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {width: 150, crop: "scale"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150));
```

![Video scaled to a width of 150 pixels](https://res.cloudinary.com/demo/video/upload/c_scale,w_150/guy_woman_mobile.mp4 "width:150")

```nodejs
cloudinary.video("guy_woman_mobile", {width: 150, crop: "scale"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(150));
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(150));
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(150));
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(150));
```

```python
CloudinaryVideo("guy_woman_mobile").video(width=150, crop="scale")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::scale()->width(150));
```

```java
cloudinary.url().transformation(new Transformation().width(150).crop("scale")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", width: 150, crop: "scale")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Width(150).Crop("scale")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(150)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setWidth(150).setCrop("scale")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().width(150).crop("scale")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(150)));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.scale() { width(150) }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {width: 150, crop: "scale"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(150));
```

#### Example 2: Scale without maintaining aspect ratio

Scale the camera image to a width and height of 150 pixels without maintaining the aspect ratio:

![Image scaled to a width and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/c_scale,h_150,w_150/docs/camera.jpg "width:150")

```nodejs
cloudinary.image("docs/camera.jpg", {height: 150, width: 150, crop: "scale"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150).height(150));
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150).height(150));
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150).height(150));
```

```js
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150).height(150));
```

```python
CloudinaryImage("docs/camera.jpg").image(height=150, width=150, crop="scale")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::scale()->width(150)
->height(150));
```

```java
cloudinary.url().transformation(new Transformation().height(150).width(150).crop("scale")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", height: 150, width: 150, crop: "scale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(150).Width(150).Crop("scale")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(150)
.height(150)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(150).setWidth(150).setCrop("scale")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(150).width(150).crop("scale")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(150)
.height(150)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.scale() { width(150)
 height(150) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {height: 150, width: 150, crop: "scale"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(scale().width(150).height(150));
```

![Video scaled to a width and height of 150 pixels](https://res.cloudinary.com/demo/video/upload/c_scale,h_150,w_150/guy_woman_mobile.mp4 "width:150")

```nodejs
cloudinary.video("guy_woman_mobile", {height: 150, width: 150, crop: "scale"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(150).height(150)
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(150).height(150)
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(150).height(150)
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(150).height(150)
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(height=150, width=150, crop="scale")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::scale()->width(150)
->height(150));
```

```java
cloudinary.url().transformation(new Transformation().height(150).width(150).crop("scale")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", height: 150, width: 150, crop: "scale")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Height(150).Width(150).Crop("scale")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(150)
.height(150)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setHeight(150).setWidth(150).setCrop("scale")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().height(150).width(150).crop("scale")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(150)
.height(150)));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.scale() { width(150)
 height(150) }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {height: 150, width: 150, crop: "scale"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(150).height(150)
);
```

#### Example 3: Scale by a percentage

Scale the camera image to a width of 25% (maintains the aspect ratio by default):

![Image scaled to a width of 25%](https://res.cloudinary.com/demo/image/upload/c_scale,w_0.25/docs/camera.jpg "width:320")

```nodejs
cloudinary.image("docs/camera.jpg", {width: "0.25", crop: "scale"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(scale().width(0.25));
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(scale().width(0.25));
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(scale().width(0.25));
```

```js
new CloudinaryImage("docs/camera.jpg").resize(scale().width(0.25));
```

```python
CloudinaryImage("docs/camera.jpg").image(width="0.25", crop="scale")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::scale()->width(0.25));
```

```java
cloudinary.url().transformation(new Transformation().width(0.25).crop("scale")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", width: 0.25, crop: "scale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Width(0.25).Crop("scale")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(0.25)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setWidth(0.25).setCrop("scale")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().width(0.25).crop("scale")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(0.25)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.scale() { width(0.25F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {width: "0.25", crop: "scale"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(scale().width(0.25));
```

![Video scaled to a width of 25%](https://res.cloudinary.com/demo/video/upload/c_scale,w_0.25/guy_woman_mobile.mp4 "width:480")

```nodejs
cloudinary.video("guy_woman_mobile", {width: "0.25", crop: "scale"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(0.25));
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(0.25));
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(0.25));
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(0.25));
```

```python
CloudinaryVideo("guy_woman_mobile").video(width="0.25", crop="scale")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::scale()->width(0.25));
```

```java
cloudinary.url().transformation(new Transformation().width(0.25).crop("scale")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", width: 0.25, crop: "scale")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Width(0.25).Crop("scale")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(0.25)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setWidth(0.25).setCrop("scale")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().width(0.25).crop("scale")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(0.25)));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.scale() { width(0.25F) }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {width: "0.25", crop: "scale"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(scale().width(0.25));
```

#### Example 4: Scale by setting the aspect ratio and width

Scale the camera image to a width of 100, changing the aspect ratio to 1:2:

![Image scaled using aspect ratio](https://res.cloudinary.com/demo/image/upload/ar_1:2,c_scale,w_100/docs/camera.jpg "width:100")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "1:2", width: 100, crop: "scale"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="1:2", width=100, crop="scale")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::scale()->width(100)
->aspectRatio("1:2"));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1:2").width(100).crop("scale")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "1:2", width: 100, crop: "scale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1:2").Width(100).Crop("scale")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(100)
.aspectRatio("1:2")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1:2").setWidth(100).setCrop("scale")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1:2").width(100).crop("scale")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.scale().width(100)
.aspectRatio("1:2")));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.scale() { width(100)
 aspectRatio("1:2") }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "1:2", width: 100, crop: "scale"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  scale().width(100).aspectRatio("1:2")
);
```

![Video scaled using aspect ratio](https://res.cloudinary.com/demo/video/upload/ar_1:2,c_scale,w_100/guy_woman_mobile.mp4 "width:100")

```nodejs
cloudinary.video("guy_woman_mobile", {aspect_ratio: "1:2", width: 100, crop: "scale"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(100).aspectRatio("1:2")
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(aspect_ratio="1:2", width=100, crop="scale")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::scale()->width(100)
->aspectRatio("1:2"));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1:2").width(100).crop("scale")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", aspect_ratio: "1:2", width: 100, crop: "scale")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().AspectRatio("1:2").Width(100).Crop("scale")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(100)
.aspectRatio("1:2")));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setAspectRatio("1:2").setWidth(100).setCrop("scale")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1:2").width(100).crop("scale")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.scale().width(100)
.aspectRatio("1:2")));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.scale() { width(100)
 aspectRatio("1:2") }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {aspect_ratio: "1:2", width: 100, crop: "scale"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  scale().width(100).aspectRatio("1:2")
);
```

#### Example 5: Scale in one dimension ignoring the aspect ratio

Scale the image to a height of 150, ignoring the aspect ratio:

![Image scaled ignoring aspect ratio](https://res.cloudinary.com/demo/image/upload/c_scale,fl_ignore_aspect_ratio,h_150/docs/camera-640.jpg "width:640")

```nodejs
cloudinary.image("docs/camera-640.jpg", {flags: "ignore_aspect_ratio", height: 150, crop: "scale"})
```

```react
new CloudinaryImage("docs/camera-640.jpg").resize(
  scale()
    .height(150)
    .aspectRatio(ignoreInitialAspectRatio())
);
```

```vue
new CloudinaryImage("docs/camera-640.jpg").resize(
  scale()
    .height(150)
    .aspectRatio(ignoreInitialAspectRatio())
);
```

```angular
new CloudinaryImage("docs/camera-640.jpg").resize(
  scale()
    .height(150)
    .aspectRatio(ignoreInitialAspectRatio())
);
```

```js
new CloudinaryImage("docs/camera-640.jpg").resize(
  scale()
    .height(150)
    .aspectRatio(ignoreInitialAspectRatio())
);
```

```python
CloudinaryImage("docs/camera-640.jpg").image(flags="ignore_aspect_ratio", height=150, crop="scale")
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::scale()->height(150)
	->aspectRatio(
	AspectRatio::ignoreInitialAspectRatio())
	);
```

```java
cloudinary.url().transformation(new Transformation().flags("ignore_aspect_ratio").height(150).crop("scale")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", flags: "ignore_aspect_ratio", height: 150, crop: "scale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Flags("ignore_aspect_ratio").Height(150).Crop("scale")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.scale().height(150)
	.aspectRatio(
	AspectRatio.ignoreInitialAspectRatio())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setFlags("ignore_aspect_ratio").setHeight(150).setCrop("scale")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().flags("ignore_aspect_ratio").height(150).crop("scale")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.scale().height(150)
	.aspectRatio(
	AspectRatio.ignoreInitialAspectRatio())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.scale() { height(150)
	 aspectRatio(
	AspectRatio.ignoreInitialAspectRatio())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {flags: "ignore_aspect_ratio", height: 150, crop: "scale"})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg").resize(
  scale()
    .height(150)
    .aspectRatio(ignoreInitialAspectRatio())
);
```

> **TIP**: The `scale` mode can be used to scale up or scale down an image, however when scaling up, the image often loses clarity. To retain clarity while upscaling an image, consider [upscaling with super resolution](#upscaling_with_super_resolution).

### fit

The `fit` resize mode resizes the image so that it takes up as much space as possible within a bounding box defined by the specified dimensions. The original aspect ratio is retained and all of the original image is visible. 

**See full syntax**: [c_fit](transformation_reference#c_fit) in the _Transformation Reference_.

#### Example 1: Fit the image inside a square bounding box

Resize the camera image to fit within a width and height of 250 pixels while retaining the aspect ratio:

![Image fit to a width and height of 250 pixels](https://res.cloudinary.com/demo/image/upload/c_fit,h_250,w_250/docs/camera.jpg "width: 250")

```nodejs
cloudinary.image("docs/camera.jpg", {height: 250, width: 250, crop: "fit"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(fit().width(250).height(250));
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(fit().width(250).height(250));
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(fit().width(250).height(250));
```

```js
new CloudinaryImage("docs/camera.jpg").resize(fit().width(250).height(250));
```

```python
CloudinaryImage("docs/camera.jpg").image(height=250, width=250, crop="fit")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::fit()->width(250)
->height(250));
```

```java
cloudinary.url().transformation(new Transformation().height(250).width(250).crop("fit")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", height: 250, width: 250, crop: "fit")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(250).Width(250).Crop("fit")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fit().width(250)
.height(250)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(250).setWidth(250).setCrop("fit")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(250).width(250).crop("fit")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fit().width(250)
.height(250)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.fit() { width(250)
 height(250) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {height: 250, width: 250, crop: "fit"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(fit().width(250).height(250));
```

![Video fit to a width and height of 250 pixels](https://res.cloudinary.com/demo/video/upload/c_fit,h_250,w_250/guy_woman_mobile.mp4 "width: 250")

```nodejs
cloudinary.video("guy_woman_mobile", {height: 250, width: 250, crop: "fit"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().width(250).height(250)
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().width(250).height(250)
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().width(250).height(250)
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().width(250).height(250)
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(height=250, width=250, crop="fit")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::fit()->width(250)
->height(250));
```

```java
cloudinary.url().transformation(new Transformation().height(250).width(250).crop("fit")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", height: 250, width: 250, crop: "fit")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Height(250).Width(250).Crop("fit")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fit().width(250)
.height(250)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setHeight(250).setWidth(250).setCrop("fit")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().height(250).width(250).crop("fit")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fit().width(250)
.height(250)));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.fit() { width(250)
 height(250) }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {height: 250, width: 250, crop: "fit"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().width(250).height(250)
);
```

#### Example 2: Use aspect ratio to define a bounding box

Resize the camera image to fit within a 150-pixel square defined by aspect ratio and height:

![Image fit to a 150-pixel square](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fit,h_150/docs/camera.jpg "width: 150")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", height: 150, crop: "fit"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="1.0", height=150, crop="fit")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::fit()->height(150)
->aspectRatio(1.0));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("fit")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "1.0", height: 150, crop: "fit")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.0").Height(150).Crop("fit")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fit().height(150)
.aspectRatio('1.0')));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.0").setHeight(150).setCrop("fit")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("fit")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.fit().height(150)
.aspectRatio('1.0')));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.fit() { height(150)
 aspectRatio(1.0F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", height: 150, crop: "fit"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  fit().height(150).aspectRatio("1.0")
);
```

![Video fit to a 150-pixel square](https://res.cloudinary.com/demo/video/upload/ar_1.0,c_fit,h_150/guy_woman_mobile.mp4 "width: 150")

```nodejs
cloudinary.video("guy_woman_mobile", {aspect_ratio: "1.0", height: 150, crop: "fit"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().height(150).aspectRatio("1.0")
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(aspect_ratio="1.0", height=150, crop="fit")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::fit()->height(150)
->aspectRatio(1.0));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("fit")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", aspect_ratio: "1.0", height: 150, crop: "fit")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().AspectRatio("1.0").Height(150).Crop("fit")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fit().height(150)
.aspectRatio('1.0')));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setAspectRatio("1.0").setHeight(150).setCrop("fit")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("fit")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fit().height(150)
.aspectRatio('1.0')));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.fit() { height(150)
 aspectRatio(1.0F) }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {aspect_ratio: "1.0", height: 150, crop: "fit"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fit().height(150).aspectRatio("1.0")
);
```### limit

The `limit` resize mode behaves the same as the `fit` mode but only if the original image is larger than the specified limit (width and height), in which case the image is scaled down so that it takes up as much space as possible within a bounding box defined by the specified dimensions. The original aspect ratio is retained and all of the original image is visible. This mode doesn't scale up the image if your requested dimensions are larger than the original image's.

**See full syntax**: [c_limit](transformation_reference#c_limit) in the _Transformation Reference_.

  
#### Example 1: Limit the size of the image to a square bounding box

Limit the camera image to a width and height of 250 pixels while retaining the aspect ratio:

![image limited to a width and height of 250 pixels](https://res.cloudinary.com/demo/image/upload/c_limit,h_250,w_250/docs/camera.jpg "width:250")

```nodejs
cloudinary.image("docs/camera.jpg", {height: 250, width: 250, crop: "limit"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().width(250).height(250)
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().width(250).height(250)
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().width(250).height(250)
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().width(250).height(250)
);
```

```python
CloudinaryImage("docs/camera.jpg").image(height=250, width=250, crop="limit")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::limitFit()->width(250)
->height(250));
```

```java
cloudinary.url().transformation(new Transformation().height(250).width(250).crop("limit")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", height: 250, width: 250, crop: "limit")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(250).Width(250).Crop("limit")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFit().width(250)
.height(250)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(250).setWidth(250).setCrop("limit")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(250).width(250).crop("limit")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFit().width(250)
.height(250)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.limitFit() { width(250)
 height(250) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {height: 250, width: 250, crop: "limit"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().width(250).height(250)
);
```

![image limited to a width and height of 250 pixels](https://res.cloudinary.com/demo/video/upload/c_limit,h_250,w_250/guy_woman_mobile.mp4 "width:250")

```nodejs
cloudinary.video("guy_woman_mobile", {height: 250, width: 250, crop: "limit"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().width(250).height(250)
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().width(250).height(250)
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().width(250).height(250)
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().width(250).height(250)
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(height=250, width=250, crop="limit")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::limitFit()->width(250)
->height(250));
```

```java
cloudinary.url().transformation(new Transformation().height(250).width(250).crop("limit")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", height: 250, width: 250, crop: "limit")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Height(250).Width(250).Crop("limit")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitFit().width(250)
.height(250)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setHeight(250).setWidth(250).setCrop("limit")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().height(250).width(250).crop("limit")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitFit().width(250)
.height(250)));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.limitFit() { width(250)
 height(250) }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {height: 250, width: 250, crop: "limit"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().width(250).height(250)
);
```

#### Example 2: Use aspect ratio to define a limiting bounding box

Limit the camera image to a 150-pixel square defined by aspect ratio and height:

![image limited to a 150-pixel square](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_limit,h_150/docs/camera.jpg "width:150")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", height: 150, crop: "limit"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="1.0", height=150, crop="limit")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::limitFit()->height(150)
->aspectRatio(1.0));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("limit")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "1.0", height: 150, crop: "limit")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.0").Height(150).Crop("limit")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFit().height(150)
.aspectRatio('1.0')));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.0").setHeight(150).setCrop("limit")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("limit")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitFit().height(150)
.aspectRatio('1.0')));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.limitFit() { height(150)
 aspectRatio(1.0F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", height: 150, crop: "limit"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

![image limited to a 150-pixel square](https://res.cloudinary.com/demo/video/upload/ar_1.0,c_limit,h_150/guy_woman_mobile.mp4 "width:150")

```nodejs
cloudinary.video("guy_woman_mobile", {aspect_ratio: "1.0", height: 150, crop: "limit"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(aspect_ratio="1.0", height=150, crop="limit")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::limitFit()->height(150)
->aspectRatio(1.0));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("limit")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", aspect_ratio: "1.0", height: 150, crop: "limit")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().AspectRatio("1.0").Height(150).Crop("limit")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitFit().height(150)
.aspectRatio('1.0')));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setAspectRatio("1.0").setHeight(150).setCrop("limit")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("limit")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitFit().height(150)
.aspectRatio('1.0')));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.limitFit() { height(150)
 aspectRatio(1.0F) }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {aspect_ratio: "1.0", height: 150, crop: "limit"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitFit().height(150).aspectRatio("1.0")
);
```
### mfit (minimum fit)

The `mfit` resize mode behaves the same as the `fit` mode but only if the original image is smaller than the specified minimum (width and height), in which case the image is scaled up so that it takes up as much space as possible within a bounding box defined by the specified dimensions. The original aspect ratio is retained and all of the original image is visible. This mode doesn't scale down the image if your requested dimensions are smaller than the original image's.

**See full syntax**: [c_mfit](transformation_reference#c_mfit) in the _Transformation Reference_.

#### Example 1: Ensure an image fits a minimum bounding box

Fit the `camera-640` image (640 x 427 pixels) to a minimum width and height of 250 pixels while retaining the aspect ratio. This results in the original larger image being delivered:

![Image mfit to a width and height of 250 pixels](https://res.cloudinary.com/demo/image/upload/c_mfit,h_250,w_250/docs/camera-640.jpg "width:250")

```nodejs
cloudinary.image("docs/camera-640.jpg", {height: 250, width: 250, crop: "mfit"})
```

```react
new CloudinaryImage("docs/camera-640.jpg").resize(
  minimumFit().width(250).height(250)
);
```

```vue
new CloudinaryImage("docs/camera-640.jpg").resize(
  minimumFit().width(250).height(250)
);
```

```angular
new CloudinaryImage("docs/camera-640.jpg").resize(
  minimumFit().width(250).height(250)
);
```

```js
new CloudinaryImage("docs/camera-640.jpg").resize(
  minimumFit().width(250).height(250)
);
```

```python
CloudinaryImage("docs/camera-640.jpg").image(height=250, width=250, crop="mfit")
```

```php
(new ImageTag('docs/camera-640.jpg'))
	->resize(Resize::minimumFit()->width(250)
->height(250));
```

```java
cloudinary.url().transformation(new Transformation().height(250).width(250).crop("mfit")).imageTag("docs/camera-640.jpg");
```

```ruby
cl_image_tag("docs/camera-640.jpg", height: 250, width: 250, crop: "mfit")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(250).Width(250).Crop("mfit")).BuildImageTag("docs/camera-640.jpg")
```

```dart
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.minimumFit().width(250)
.height(250)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(250).setWidth(250).setCrop("mfit")).generate("docs/camera-640.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(250).width(250).crop("mfit")).generate("docs/camera-640.jpg");
```

```flutter
cloudinary.image('docs/camera-640.jpg').transformation(Transformation()
	.resize(Resize.minimumFit().width(250)
.height(250)));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-640.jpg")
	 resize(Resize.minimumFit() { width(250)
 height(250) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-640.jpg", {height: 250, width: 250, crop: "mfit"})
```

```react_native
new CloudinaryImage("docs/camera-640.jpg").resize(
  minimumFit().width(250).height(250)
);
```

#### Example 2: Use aspect ratio to define a minimum size

Scale up the 100-pixel wide `camera-100` image to fit a 150-pixel square defined by aspect ratio and height.

![Image mfit to a 150-pixel square](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_mfit,h_150/docs/camera-100.jpg "width:150")

```nodejs
cloudinary.image("docs/camera-100.jpg", {aspect_ratio: "1.0", height: 150, crop: "mfit"})
```

```react
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumFit().height(150).aspectRatio("1.0")
);
```

```vue
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumFit().height(150).aspectRatio("1.0")
);
```

```angular
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumFit().height(150).aspectRatio("1.0")
);
```

```js
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumFit().height(150).aspectRatio("1.0")
);
```

```python
CloudinaryImage("docs/camera-100.jpg").image(aspect_ratio="1.0", height=150, crop="mfit")
```

```php
(new ImageTag('docs/camera-100.jpg'))
	->resize(Resize::minimumFit()->height(150)
->aspectRatio(1.0));
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("mfit")).imageTag("docs/camera-100.jpg");
```

```ruby
cl_image_tag("docs/camera-100.jpg", aspect_ratio: "1.0", height: 150, crop: "mfit")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.0").Height(150).Crop("mfit")).BuildImageTag("docs/camera-100.jpg")
```

```dart
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumFit().height(150)
.aspectRatio('1.0')));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.0").setHeight(150).setCrop("mfit")).generate("docs/camera-100.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").height(150).crop("mfit")).generate("docs/camera-100.jpg");
```

```flutter
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumFit().height(150)
.aspectRatio('1.0')));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-100.jpg")
	 resize(Resize.minimumFit() { height(150)
 aspectRatio(1.0F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-100.jpg", {aspect_ratio: "1.0", height: 150, crop: "mfit"})
```

```react_native
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumFit().height(150).aspectRatio("1.0")
);
```

### pad

The `pad` resize mode resizes the image to fill the specified dimensions while retaining the original aspect ratio and with all of the original image visible. If the proportions of the original image do not match the specified dimensions, padding is added to the image to reach the required size. You can also specify where the original image is placed by using the [gravity](#control_gravity) parameter (set to `center` by default), and specify the color of the [background](effects_and_artistic_enhancements#setting_background_color) in the case that padding is added.

**See full syntax**: [c_pad](transformation_reference#c_pad) in the _Transformation Reference_.

#### Example 1: Resize and pad an image to fill the square defined by width and height

Resize and pad the camera image with a brown background to a width and height of 250 pixels:

![Image padded to a width and height of 250 pixels](https://res.cloudinary.com/demo/image/upload/b_brown,c_pad,h_250,w_250/docs/camera.jpg "width:250")

```nodejs
cloudinary.image("docs/camera.jpg", {background: "brown", height: 250, width: 250, crop: "pad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(background="brown", height=250, width=250, crop="pad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::pad()->width(250)
->height(250)
	->background(
	Background::color(Color::BROWN))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("brown").height(250).width(250).crop("pad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", background: "brown", height: 250, width: 250, crop: "pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("brown").Height(250).Width(250).Crop("pad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.pad().width(250)
.height(250)
	.background(
	Background.color(Color.BROWN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("brown").setHeight(250).setWidth(250).setCrop("pad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("brown").height(250).width(250).crop("pad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.pad().width(250)
.height(250)
	.background(
	Background.color(Color.BROWN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.pad() { width(250)
 height(250)
	 background(
	Background.color(Color.BROWN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {background: "brown", height: 250, width: 250, crop: "pad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

![Video padded to a width and height of 250 pixels](https://res.cloudinary.com/demo/video/upload/b_brown,c_pad,h_250,w_250/guy_woman_mobile.mp4 "width:250")

```nodejs
cloudinary.video("guy_woman_mobile", {background: "brown", height: 250, width: 250, crop: "pad"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(background="brown", height=250, width=250, crop="pad")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::pad()->width(250)
->height(250)
	->background(
	Background::color(Color::BROWN))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("brown").height(250).width(250).crop("pad")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", background: "brown", height: 250, width: 250, crop: "pad")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Background("brown").Height(250).Width(250).Crop("pad")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.pad().width(250)
.height(250)
	.background(
	Background.color(Color.BROWN))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setBackground("brown").setHeight(250).setWidth(250).setCrop("pad")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().background("brown").height(250).width(250).crop("pad")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.pad().width(250)
.height(250)
	.background(
	Background.color(Color.BROWN))
	));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.pad() { width(250)
 height(250)
	 background(
	Background.color(Color.BROWN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {background: "brown", height: 250, width: 250, crop: "pad"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .width(250)
    .height(250)
    .background(color("brown"))
);
```

#### Example 2: Resize and pad an image to fill the rectangle defined by aspect ratio

Resize and pad the camera image with a brown background to a rectangle of height of 150 pixels, and aspect ratio 2:1:

![Image padded to a height of 150 pixels and aspect ratio 2:1](https://res.cloudinary.com/demo/image/upload/ar_2:1,b_brown,c_pad,h_150/docs/camera.jpg "width:300")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "2:1", background: "brown", height: 150, crop: "pad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="2:1", background="brown", height=150, crop="pad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::pad()->height(150)
->aspectRatio("2:1")
	->background(
	Background::color(Color::BROWN))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("2:1").background("brown").height(150).crop("pad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "2:1", background: "brown", height: 150, crop: "pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("2:1").Background("brown").Height(150).Crop("pad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.pad().height(150)
.aspectRatio("2:1")
	.background(
	Background.color(Color.BROWN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("2:1").setBackground("brown").setHeight(150).setCrop("pad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("2:1").background("brown").height(150).crop("pad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.pad().height(150)
.aspectRatio("2:1")
	.background(
	Background.color(Color.BROWN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.pad() { height(150)
 aspectRatio("2:1")
	 background(
	Background.color(Color.BROWN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "2:1", background: "brown", height: 150, crop: "pad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

![Video padded to a height of 150 pixels and aspect ratio 2:1](https://res.cloudinary.com/demo/video/upload/ar_2:1,b_brown,c_pad,h_150/guy_woman_mobile.mp4 "width:300")

```nodejs
cloudinary.video("guy_woman_mobile", {aspect_ratio: "2:1", background: "brown", height: 150, crop: "pad"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(aspect_ratio="2:1", background="brown", height=150, crop="pad")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::pad()->height(150)
->aspectRatio("2:1")
	->background(
	Background::color(Color::BROWN))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("2:1").background("brown").height(150).crop("pad")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", aspect_ratio: "2:1", background: "brown", height: 150, crop: "pad")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().AspectRatio("2:1").Background("brown").Height(150).Crop("pad")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.pad().height(150)
.aspectRatio("2:1")
	.background(
	Background.color(Color.BROWN))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setAspectRatio("2:1").setBackground("brown").setHeight(150).setCrop("pad")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("2:1").background("brown").height(150).crop("pad")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.pad().height(150)
.aspectRatio("2:1")
	.background(
	Background.color(Color.BROWN))
	));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.pad() { height(150)
 aspectRatio("2:1")
	 background(
	Background.color(Color.BROWN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {aspect_ratio: "2:1", background: "brown", height: 150, crop: "pad"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  pad()
    .height(150)
    .aspectRatio("2:1")
    .background(color("brown"))
);
```### lpad (limit pad)

The `lpad` resize mode behaves the same as the `pad` mode but only if the original image is larger than the specified limit (width and height), in which case the image is scaled down to fill the specified dimensions while retaining the original aspect ratio and with all of the original image visible. This mode doesn't scale up the image if your requested dimensions are bigger than the original image's. If the proportions of the original image do not match the specified dimensions, padding is added to the image to reach the required size. You can also specify where the original image is placed by using the [gravity](#control_gravity) parameter (set to `center` by default), and specify the color of the [background][background-color-link] in the case that padding is added.

**See full syntax**: [c_lpad](transformation_reference#c_lpad) in the _Transformation Reference_.

#### Example 1: Scale down and pad an image

Limit the sample image to a bounding box of 400 x 150 pixels, and pad with a green background:

![Image lpadded to a width of 400 and height of 150 pixels](https://res.cloudinary.com/demo/image/upload/b_green,c_lpad,h_150,w_400/docs/camera.jpg "width: 400")

```nodejs
cloudinary.image("docs/camera.jpg", {background: "green", height: 150, width: 400, crop: "lpad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(background="green", height=150, width=400, crop="lpad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::limitPad()->width(400)
->height(150)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("green").height(150).width(400).crop("lpad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", background: "green", height: 150, width: 400, crop: "lpad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("green").Height(150).Width(400).Crop("lpad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitPad().width(400)
.height(150)
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("green").setHeight(150).setWidth(400).setCrop("lpad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("green").height(150).width(400).crop("lpad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitPad().width(400)
.height(150)
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.limitPad() { width(400)
 height(150)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {background: "green", height: 150, width: 400, crop: "lpad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

![Video lpadded to a width of 400 and height of 150 pixels](https://res.cloudinary.com/demo/video/upload/b_green,c_lpad,h_150,w_400/guy_woman_mobile.mp4 "width: 400")

```nodejs
cloudinary.video("guy_woman_mobile", {background: "green", height: 150, width: 400, crop: "lpad"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(background="green", height=150, width=400, crop="lpad")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::limitPad()->width(400)
->height(150)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("green").height(150).width(400).crop("lpad")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", background: "green", height: 150, width: 400, crop: "lpad")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Background("green").Height(150).Width(400).Crop("lpad")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitPad().width(400)
.height(150)
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setBackground("green").setHeight(150).setWidth(400).setCrop("lpad")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().background("green").height(150).width(400).crop("lpad")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitPad().width(400)
.height(150)
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.limitPad() { width(400)
 height(150)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {background: "green", height: 150, width: 400, crop: "lpad"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(400)
    .height(150)
    .background(color("green"))
);
```

#### Example 2: Scale down and pad an image using aspect ratio

Limit the sample image to a bounding box specified by an aspect ratio of 0.66 with a width of 100 pixels, and pad with a green background:

![Image lpadded to a width of 100 pixels and aspect ratio of 0.66](https://res.cloudinary.com/demo/image/upload/ar_0.66,b_green,c_lpad,w_100/docs/camera.jpg "width: 100")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "0.66", background: "green", width: 100, crop: "lpad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="0.66", background="green", width=100, crop="lpad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::limitPad()->width(100)
->aspectRatio(0.66)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("0.66").background("green").width(100).crop("lpad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "0.66", background: "green", width: 100, crop: "lpad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("0.66").Background("green").Width(100).Crop("lpad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitPad().width(100)
.aspectRatio(0.66)
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("0.66").setBackground("green").setWidth(100).setCrop("lpad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("0.66").background("green").width(100).crop("lpad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitPad().width(100)
.aspectRatio(0.66)
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.limitPad() { width(100)
 aspectRatio(0.66F)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "0.66", background: "green", width: 100, crop: "lpad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

![Video lpadded to a width of 100 pixels and aspect ratio of 0.66](https://res.cloudinary.com/demo/video/upload/ar_0.66,b_green,c_lpad,w_100/guy_woman_mobile.mp4 "width: 100")

```nodejs
cloudinary.video("guy_woman_mobile", {aspect_ratio: "0.66", background: "green", width: 100, crop: "lpad"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(aspect_ratio="0.66", background="green", width=100, crop="lpad")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::limitPad()->width(100)
->aspectRatio(0.66)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("0.66").background("green").width(100).crop("lpad")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", aspect_ratio: "0.66", background: "green", width: 100, crop: "lpad")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().AspectRatio("0.66").Background("green").Width(100).Crop("lpad")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitPad().width(100)
.aspectRatio(0.66)
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setAspectRatio("0.66").setBackground("green").setWidth(100).setCrop("lpad")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("0.66").background("green").width(100).crop("lpad")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitPad().width(100)
.aspectRatio(0.66)
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.limitPad() { width(100)
 aspectRatio(0.66F)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {aspect_ratio: "0.66", background: "green", width: 100, crop: "lpad"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(100)
    .aspectRatio(0.66)
    .background(color("green"))
);
```

#### Example 3: Pad an image on all sides

Apply padding to all sides of the sample image by specifying a bounding box that's square, and has a width of 1.1 times the original width:

![Image padded on both sides](https://res.cloudinary.com/demo/image/upload/ar_1.0,b_green,c_lpad,w_1.1/docs/camera.jpg "thumb:c_scale,w_300, width:300")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", background: "green", width: "1.1", crop: "lpad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="1.0", background="green", width="1.1", crop="lpad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::limitPad()->width(1.1)
->aspectRatio(1.0)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").background("green").width(1.1).crop("lpad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "1.0", background: "green", width: 1.1, crop: "lpad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.0").Background("green").Width(1.1).Crop("lpad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitPad().width(1.1)
.aspectRatio('1.0')
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.0").setBackground("green").setWidth(1.1).setCrop("lpad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").background("green").width(1.1).crop("lpad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.limitPad().width(1.1)
.aspectRatio('1.0')
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.limitPad() { width(1.1F)
 aspectRatio(1.0F)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", background: "green", width: "1.1", crop: "lpad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

![Video padded on both sides](https://res.cloudinary.com/demo/video/upload/ar_1.0,b_green,c_lpad,w_1.1/guy_woman_mobile.mp4 "thumb:c_scale,w_300, width:300")

```nodejs
cloudinary.video("guy_woman_mobile", {aspect_ratio: "1.0", background: "green", width: "1.1", crop: "lpad"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(aspect_ratio="1.0", background="green", width="1.1", crop="lpad")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::limitPad()->width(1.1)
->aspectRatio(1.0)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").background("green").width(1.1).crop("lpad")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", aspect_ratio: "1.0", background: "green", width: 1.1, crop: "lpad")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().AspectRatio("1.0").Background("green").Width(1.1).Crop("lpad")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitPad().width(1.1)
.aspectRatio('1.0')
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setAspectRatio("1.0").setBackground("green").setWidth(1.1).setCrop("lpad")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").background("green").width(1.1).crop("lpad")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.limitPad().width(1.1)
.aspectRatio('1.0')
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.limitPad() { width(1.1F)
 aspectRatio(1.0F)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {aspect_ratio: "1.0", background: "green", width: "1.1", crop: "lpad"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  limitPad()
    .width(1.1)
    .aspectRatio("1.0")
    .background(color("green"))
);
```
### mpad (minimum pad)

The `mpad` resize mode behaves the same as the `pad` mode but only if the original image is smaller than the specified minimum (width and height), in which case the image is unchanged but padding is added to fill the specified dimensions. This mode doesn't scale down the image if your requested dimensions are smaller than the original image's. You can also specify where the original image is placed by using the [gravity](#control_gravity) parameter (set to `center` by default), and specify the color of the [background](effects_and_artistic_enhancements#setting_background_color) in the case that padding is added.

**See full syntax**: [c_mpad](transformation_reference#c_mpad) in the _Transformation Reference_.

#### Example 1: Pad an image to the specified width and height

Minimum pad the 100-pixel wide image `camera-100` to a width and height of 200 pixels while retaining the aspect ratio:

![Image mpadded to a width and height of 200 pixels](https://res.cloudinary.com/demo/image/upload/b_green,c_mpad,h_200,w_200/docs/camera-100.jpg "width:200")

```nodejs
cloudinary.image("docs/camera-100.jpg", {background: "green", height: 200, width: 200, crop: "mpad"})
```

```react
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(200)
    .height(200)
    .background(color("green"))
);
```

```vue
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(200)
    .height(200)
    .background(color("green"))
);
```

```angular
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(200)
    .height(200)
    .background(color("green"))
);
```

```js
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(200)
    .height(200)
    .background(color("green"))
);
```

```python
CloudinaryImage("docs/camera-100.jpg").image(background="green", height=200, width=200, crop="mpad")
```

```php
(new ImageTag('docs/camera-100.jpg'))
	->resize(Resize::minimumPad()->width(200)
->height(200)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("green").height(200).width(200).crop("mpad")).imageTag("docs/camera-100.jpg");
```

```ruby
cl_image_tag("docs/camera-100.jpg", background: "green", height: 200, width: 200, crop: "mpad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("green").Height(200).Width(200).Crop("mpad")).BuildImageTag("docs/camera-100.jpg")
```

```dart
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(200)
.height(200)
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("green").setHeight(200).setWidth(200).setCrop("mpad")).generate("docs/camera-100.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("green").height(200).width(200).crop("mpad")).generate("docs/camera-100.jpg");
```

```flutter
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(200)
.height(200)
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-100.jpg")
	 resize(Resize.minimumPad() { width(200)
 height(200)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-100.jpg", {background: "green", height: 200, width: 200, crop: "mpad"})
```

```react_native
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(200)
    .height(200)
    .background(color("green"))
);
```

#### Example 2: Ensure an image fits a minimum bounding box using padding

Minimum pad the `camera` image to a square of 200 pixels, defined by aspect ratio and width. This results in the original larger image being delivered:

![Image left unchanged](https://res.cloudinary.com/demo/image/upload/ar_1.0,b_green,c_mpad,w_200/docs/camera.jpg "thumb: w_700, width:700")

```nodejs
cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", background: "green", width: 200, crop: "mpad"})
```

```react
new CloudinaryImage("docs/camera.jpg").resize(
  minimumPad()
    .width(200)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").resize(
  minimumPad()
    .width(200)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").resize(
  minimumPad()
    .width(200)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```js
new CloudinaryImage("docs/camera.jpg").resize(
  minimumPad()
    .width(200)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(aspect_ratio="1.0", background="green", width=200, crop="mpad")
```

```php
(new ImageTag('docs/camera.jpg'))
	->resize(Resize::minimumPad()->width(200)
->aspectRatio(1.0)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.0").background("green").width(200).crop("mpad")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", aspect_ratio: "1.0", background: "green", width: 200, crop: "mpad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.0").Background("green").Width(200).Crop("mpad")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(200)
.aspectRatio('1.0')
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.0").setBackground("green").setWidth(200).setCrop("mpad")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.0").background("green").width(200).crop("mpad")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(200)
.aspectRatio('1.0')
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 resize(Resize.minimumPad() { width(200)
 aspectRatio(1.0F)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {aspect_ratio: "1.0", background: "green", width: 200, crop: "mpad"})
```

```react_native
new CloudinaryImage("docs/camera.jpg").resize(
  minimumPad()
    .width(200)
    .aspectRatio("1.0")
    .background(color("green"))
);
```

#### Example 3: Pad non-centered image to the specified width and height

Minimum pad the 100-pixel wide image `camera-100` to a 175 x 125 pixel rectangle, positioned offset from the top-left:

![Image mpadded to a width and height of 200 pixels with gravity west](https://res.cloudinary.com/demo/image/upload/b_pink,c_mpad,g_north_west,h_125,w_175,x_20,y_20/docs/camera-100.jpg "width:175")

```nodejs
cloudinary.image("docs/camera-100.jpg", {background: "pink", gravity: "north_west", height: 125, width: 175, x: 20, y: 20, crop: "mpad"})
```

```react
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(175)
    .height(125)
    .gravity(compass("north_west"))
    .offsetX(20)
    .offsetY(20)
    .background(color("pink"))
);
```

```vue
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(175)
    .height(125)
    .gravity(compass("north_west"))
    .offsetX(20)
    .offsetY(20)
    .background(color("pink"))
);
```

```angular
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(175)
    .height(125)
    .gravity(compass("north_west"))
    .offsetX(20)
    .offsetY(20)
    .background(color("pink"))
);
```

```js
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(175)
    .height(125)
    .gravity(compass("north_west"))
    .offsetX(20)
    .offsetY(20)
    .background(color("pink"))
);
```

```python
CloudinaryImage("docs/camera-100.jpg").image(background="pink", gravity="north_west", height=125, width=175, x=20, y=20, crop="mpad")
```

```php
(new ImageTag('docs/camera-100.jpg'))
	->resize(Resize::minimumPad()->width(175)
->height(125)
	->gravity(
	Gravity::compass(
	Compass::northWest()))
->offsetX(20)
->offsetY(20)
	->background(
	Background::color(Color::PINK))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("pink").gravity("north_west").height(125).width(175).x(20).y(20).crop("mpad")).imageTag("docs/camera-100.jpg");
```

```ruby
cl_image_tag("docs/camera-100.jpg", background: "pink", gravity: "north_west", height: 125, width: 175, x: 20, y: 20, crop: "mpad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("pink").Gravity("north_west").Height(125).Width(175).X(20).Y(20).Crop("mpad")).BuildImageTag("docs/camera-100.jpg")
```

```dart
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(175)
.height(125)
	.gravity(
	Gravity.compass(
	Compass.northWest()))
.offsetX(20)
.offsetY(20)
	.background(
	Background.color(Color.PINK))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("pink").setGravity("north_west").setHeight(125).setWidth(175).setX(20).setY(20).setCrop("mpad")).generate("docs/camera-100.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("pink").gravity("north_west").height(125).width(175).x(20).y(20).crop("mpad")).generate("docs/camera-100.jpg");
```

```flutter
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(175)
.height(125)
	.gravity(
	Gravity.compass(
	Compass.northWest()))
.offsetX(20)
.offsetY(20)
	.background(
	Background.color(Color.PINK))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-100.jpg")
	 resize(Resize.minimumPad() { width(175)
 height(125)
	 gravity(
	Gravity.compass(
	Compass.northWest()))
 offsetX(20)
 offsetY(20)
	 background(
	Background.color(Color.PINK))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-100.jpg", {background: "pink", gravity: "north_west", height: 125, width: 175, x: 20, y: 20, crop: "mpad"})
```

```react_native
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(175)
    .height(125)
    .gravity(compass("north_west"))
    .offsetX(20)
    .offsetY(20)
    .background(color("pink"))
);
```

#### Example 4: Apply a border to an image

Use relative numbers for height and width to specify a border around the image:

![Image mpadded to a width and height relative to the size of the image](https://res.cloudinary.com/demo/image/upload/b_green,c_mpad,h_1.3,w_1.3/docs/camera-100.jpg "width:130")

```nodejs
cloudinary.image("docs/camera-100.jpg", {background: "green", height: "1.3", width: "1.3", crop: "mpad"})
```

```react
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(1.3)
    .height(1.3)
    .background(color("green"))
);
```

```vue
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(1.3)
    .height(1.3)
    .background(color("green"))
);
```

```angular
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(1.3)
    .height(1.3)
    .background(color("green"))
);
```

```js
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(1.3)
    .height(1.3)
    .background(color("green"))
);
```

```python
CloudinaryImage("docs/camera-100.jpg").image(background="green", height="1.3", width="1.3", crop="mpad")
```

```php
(new ImageTag('docs/camera-100.jpg'))
	->resize(Resize::minimumPad()->width(1.3)
->height(1.3)
	->background(
	Background::color(Color::GREEN))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("green").height(1.3).width(1.3).crop("mpad")).imageTag("docs/camera-100.jpg");
```

```ruby
cl_image_tag("docs/camera-100.jpg", background: "green", height: 1.3, width: 1.3, crop: "mpad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("green").Height(1.3).Width(1.3).Crop("mpad")).BuildImageTag("docs/camera-100.jpg")
```

```dart
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(1.3)
.height(1.3)
	.background(
	Background.color(Color.GREEN))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("green").setHeight(1.3).setWidth(1.3).setCrop("mpad")).generate("docs/camera-100.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("green").height(1.3).width(1.3).crop("mpad")).generate("docs/camera-100.jpg");
```

```flutter
cloudinary.image('docs/camera-100.jpg').transformation(Transformation()
	.resize(Resize.minimumPad().width(1.3)
.height(1.3)
	.background(
	Background.color(Color.GREEN))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera-100.jpg")
	 resize(Resize.minimumPad() { width(1.3F)
 height(1.3F)
	 background(
	Background.color(Color.GREEN))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera-100.jpg", {background: "green", height: "1.3", width: "1.3", crop: "mpad"})
```

```react_native
new CloudinaryImage("docs/camera-100.jpg").resize(
  minimumPad()
    .width(1.3)
    .height(1.3)
    .background(color("green"))
);
```

## Resizing and cropping interactive demo

Try out this interactive demo to see the results of different cropping methods, given a specific viewport size.

Choose your starting image, cropping mode, gravity and cropping/viewport dimensions, then click the button to generate the new image.

Square

Portrait

Landscape

Small

Original image size: 1920 x 1920

Cropping mode:

  Fill (c_fill)
  Limit fill (c_lfill)
  Fill with padding (c_fill_pad)
  Crop (c_crop)
  Thumbnail (c_thumb)
  Auto (c_auto)
  Scale (c_scale)
  Fit (c_fit)
  Limit fit (c_lfit)
  Minimum fit (c_mfit)
  Pad (c_pad) - auto background
  Limit pad (c_lpad) - auto background
  Minimum pad (c_mpad) - auto background
  Pad (c_pad) - AI gen background
  Limit pad (c_lpad) - AI gen background
  Minimum pad (c_mpad) - AI gen background

Gravity:

  None / Center
  Top left (g_north_west)
  Auto (g_auto)
  Auto: handbag (g_auto:handbag)
  Handbag (g_handbag)

Cropping/viewport dimensions:

  Small landscape (16:9) (h_169,w_300)
  Large landscape (16:9) (h_366,w_650)
  Small portrait (3:4) (h_300,w_225)
  Large portrait (3:4) (h_650,w_488)
  Small square (h_300,w_300)
  Large square (h_650,w_650)
  Specify no dimensions

Apply settings

 https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,h_169,w_300/docs/handbag1.jpg

**Things to know about this demo:**

* Not all combinations of cropping and gravity are valid, for example, gravity can't be used together with `scale`, or any of the `fit` or `pad` options (except `fill with padding`), and `fill with padding` only works with auto-gravity options.
* The gravity options `g_auto:handbag` and `g_handbag` use the [Cloudinary AI Content Analysis Add-on](cloudinary_ai_content_analysis_addon).
* Although Cloudinary recommends storing your highest resolution images, and delivering scaled-down versions, here you can choose between two sizes of one of the images to show how some modes can give different results depending on the resolution, and to demonstrate the different fit modes.
* The option to specify no dimensions is intended for use with `g_handbag` and a cropping option. You can also use it to compare the difference in bytes delivered with and without dimensions using other cropping modes, by inspecting the resulting image properties in your browser.

## Gravity positions for crops {anchor:control_gravity}

When used with [cropping modes](#resize_and_crop_modes) that crop out part of an image, the `gravity` qualifier (`g` in URLs) specifies which part of the original image to keep when one or both of the requested dimensions is smaller than the original.

**See full syntax**: [g (gravity)](transformation_reference#g_gravity) in the _Transformation Reference_.

### Compass positions

The basic gravity value is specified by giving a compass direction to include: `north_east`, `north`, `north_west`, `west`, `south_west`, `south`, `south_east`, `east`, or `center` (the default value). The compass direction represents a location in the image, for example, `north_east` represents the top right corner.
  
For example, [fill](#fill) a 250-pixel square with the sample image while retaining the aspect ratio:

* Original image: ![Original image](https://res.cloudinary.com/demo/image/upload/docs/livingroom3.jpg "thumb: w_500, width:500")

```nodejs
cloudinary.image("docs/livingroom3.jpg")
```

```react
new CloudinaryImage("docs/livingroom3.jpg");
```

```vue
new CloudinaryImage("docs/livingroom3.jpg");
```

```angular
new CloudinaryImage("docs/livingroom3.jpg");
```

```js
new CloudinaryImage("docs/livingroom3.jpg");
```

```python
CloudinaryImage("docs/livingroom3.jpg").image()
```

```php
(new ImageTag('docs/livingroom3.jpg'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("docs/livingroom3.jpg");
```

```ruby
cl_image_tag("docs/livingroom3.jpg")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("docs/livingroom3.jpg")
```

```dart
cloudinary.image('docs/livingroom3.jpg').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("docs/livingroom3.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("docs/livingroom3.jpg");
```

```flutter
cloudinary.image('docs/livingroom3.jpg').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("docs/livingroom3.jpg") 
}.generate()
```

```jquery
$.cloudinary.image("docs/livingroom3.jpg")
```

```react_native
new CloudinaryImage("docs/livingroom3.jpg");
``` ![Original video](https://res.cloudinary.com/demo/video/upload/guy_woman_mobile.mp4 "thumb: w_500, width:500")

```nodejs
cloudinary.video("guy_woman_mobile")
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4");
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4");
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4");
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4");
```

```python
CloudinaryVideo("guy_woman_mobile").video()
```

```php
(new VideoTag('guy_woman_mobile.mp4'));
```

```java
cloudinary.url().transformation(new Transformation().videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile")
```

```csharp
cloudinary.Api.UrlVideoUp.BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation());
```

```swift
cloudinary.createUrl().setResourceType("video").generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation());
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4") 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile")
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4");
```
* With gravity set to east: ![Image filled to a width and height of 250 pixels with east gravity](https://res.cloudinary.com/demo/image/upload/c_fill,g_east,h_250,w_250/docs/livingroom3.jpg "width:250")

```nodejs
cloudinary.image("docs/livingroom3.jpg", {gravity: "east", height: 250, width: 250, crop: "fill"})
```

```react
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```vue
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```angular
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```js
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```python
CloudinaryImage("docs/livingroom3.jpg").image(gravity="east", height=250, width=250, crop="fill")
```

```php
(new ImageTag('docs/livingroom3.jpg'))
	->resize(Resize::fill()->width(250)
->height(250)
	->gravity(
	Gravity::compass(
	Compass::east()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("east").height(250).width(250).crop("fill")).imageTag("docs/livingroom3.jpg");
```

```ruby
cl_image_tag("docs/livingroom3.jpg", gravity: "east", height: 250, width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("east").Height(250).Width(250).Crop("fill")).BuildImageTag("docs/livingroom3.jpg")
```

```dart
cloudinary.image('docs/livingroom3.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.east()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("east").setHeight(250).setWidth(250).setCrop("fill")).generate("docs/livingroom3.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("east").height(250).width(250).crop("fill")).generate("docs/livingroom3.jpg");
```

```flutter
cloudinary.image('docs/livingroom3.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.east()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/livingroom3.jpg")
	 resize(Resize.fill() { width(250)
 height(250)
	 gravity(
	Gravity.compass(
	Compass.east()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/livingroom3.jpg", {gravity: "east", height: 250, width: 250, crop: "fill"})
```

```react_native
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
``` ![Video filled to a width and height of 250 pixels with east gravity](https://res.cloudinary.com/demo/video/upload/c_fill,g_east,h_250,w_250/guy_woman_mobile.mp4 "width:250")

```nodejs
cloudinary.video("guy_woman_mobile", {gravity: "east", height: 250, width: 250, crop: "fill"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(gravity="east", height=250, width=250, crop="fill")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::fill()->width(250)
->height(250)
	->gravity(
	Gravity::compass(
	Compass::east()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("east").height(250).width(250).crop("fill")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", gravity: "east", height: 250, width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Gravity("east").Height(250).Width(250).Crop("fill")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.east()))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setGravity("east").setHeight(250).setWidth(250).setCrop("fill")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("east").height(250).width(250).crop("fill")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.east()))
	));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.fill() { width(250)
 height(250)
	 gravity(
	Gravity.compass(
	Compass.east()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {gravity: "east", height: 250, width: 250, crop: "fill"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("east"))
);
```
* With gravity set to west: ![Image filled to a width and height of 250 pixels with west gravity](https://res.cloudinary.com/demo/image/upload/c_fill,g_west,h_250,w_250/docs/livingroom3.jpg "width:250")

```nodejs
cloudinary.image("docs/livingroom3.jpg", {gravity: "west", height: 250, width: 250, crop: "fill"})
```

```react
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```vue
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```angular
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```js
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```python
CloudinaryImage("docs/livingroom3.jpg").image(gravity="west", height=250, width=250, crop="fill")
```

```php
(new ImageTag('docs/livingroom3.jpg'))
	->resize(Resize::fill()->width(250)
->height(250)
	->gravity(
	Gravity::compass(
	Compass::west()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("west").height(250).width(250).crop("fill")).imageTag("docs/livingroom3.jpg");
```

```ruby
cl_image_tag("docs/livingroom3.jpg", gravity: "west", height: 250, width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("west").Height(250).Width(250).Crop("fill")).BuildImageTag("docs/livingroom3.jpg")
```

```dart
cloudinary.image('docs/livingroom3.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.west()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("west").setHeight(250).setWidth(250).setCrop("fill")).generate("docs/livingroom3.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("west").height(250).width(250).crop("fill")).generate("docs/livingroom3.jpg");
```

```flutter
cloudinary.image('docs/livingroom3.jpg').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.west()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/livingroom3.jpg")
	 resize(Resize.fill() { width(250)
 height(250)
	 gravity(
	Gravity.compass(
	Compass.west()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/livingroom3.jpg", {gravity: "west", height: 250, width: 250, crop: "fill"})
```

```react_native
new CloudinaryImage("docs/livingroom3.jpg").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
``` ![Video filled to a width and height of 250 pixels with west gravity](https://res.cloudinary.com/demo/video/upload/c_fill,g_west,h_250,w_250/guy_woman_mobile.mp4 "width:250")

```nodejs
cloudinary.video("guy_woman_mobile", {gravity: "west", height: 250, width: 250, crop: "fill"})
```

```react
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```vue
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```angular
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```js
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```

```python
CloudinaryVideo("guy_woman_mobile").video(gravity="west", height=250, width=250, crop="fill")
```

```php
(new VideoTag('guy_woman_mobile.mp4'))
	->resize(Resize::fill()->width(250)
->height(250)
	->gravity(
	Gravity::compass(
	Compass::west()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("west").height(250).width(250).crop("fill")).videoTag("guy_woman_mobile");
```

```ruby
cl_video_tag("guy_woman_mobile", gravity: "west", height: 250, width: 250, crop: "fill")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Gravity("west").Height(250).Width(250).Crop("fill")).BuildVideoTag("guy_woman_mobile")
```

```dart
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.west()))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setGravity("west").setHeight(250).setWidth(250).setCrop("fill")).generate("guy_woman_mobile.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("west").height(250).width(250).crop("fill")).resourceType("video").generate("guy_woman_mobile.mp4");
```

```flutter
cloudinary.video('guy_woman_mobile.mp4').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(250)
	.gravity(
	Gravity.compass(
	Compass.west()))
	));
```

```kotlin
cloudinary.video {
	publicId("guy_woman_mobile.mp4")
	 resize(Resize.fill() { width(250)
 height(250)
	 gravity(
	Gravity.compass(
	Compass.west()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("guy_woman_mobile", {gravity: "west", height: 250, width: 250, crop: "fill"})
```

```react_native
new CloudinaryVideo("guy_woman_mobile.mp4").resize(
  fill()
    .width(250)
    .height(250)
    .gravity(compass("west"))
);
```
### Special positions
There are a number of special positions available to use as the focal point for image cropping, for example `g_face` to automatically detect the largest face in an image and make it the focus of the crop, and `g_custom` to use [custom coordinates](custom_focus_areas#custom_coordinates) that were previously specified (e.g., as part of the image [upload method](image_upload_api_reference#upload)) and make them the focus of the transformation.

Here's an example of focusing on the largest face using `g_face`:

![Focus on the largest face](https://res.cloudinary.com/demo/image/upload/ar_1:1,w_300,c_auto,g_face/docs/street-women.jpg "with_image: false, width:300")

```nodejs
cloudinary.image("docs/street-women.jpg", {aspect_ratio: "1:1", width: 300, gravity: "face", crop: "auto"})
```

```react
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(ar1X1())
    .gravity(focusOn(face()))
);
```

```vue
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(ar1X1())
    .gravity(focusOn(face()))
);
```

```angular
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(ar1X1())
    .gravity(focusOn(face()))
);
```

```js
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(ar1X1())
    .gravity(focusOn(face()))
);
```

```python
CloudinaryImage("docs/street-women.jpg").image(aspect_ratio="1:1", width=300, gravity="face", crop="auto")
```

```php
(new ImageTag('docs/street-women.jpg'))
	->resize(Resize::auto()->width(300)
	->aspectRatio(
	AspectRatio::ar1X1())
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1:1").width(300).gravity("face").crop("auto")).imageTag("docs/street-women.jpg");
```

```ruby
cl_image_tag("docs/street-women.jpg", aspect_ratio: "1:1", width: 300, gravity: "face", crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1:1").Width(300).Gravity("face").Crop("auto")).BuildImageTag("docs/street-women.jpg")
```

```dart
cloudinary.image('docs/street-women.jpg').transformation(Transformation()
	.resize(Resize.auto().width(300)
	.aspectRatio(
	AspectRatio.ar1X1())
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1:1").setWidth(300).setGravity("face").setCrop("auto")).generate("docs/street-women.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1:1").width(300).gravity("face").crop("auto")).generate("docs/street-women.jpg");
```

```flutter
cloudinary.image('docs/street-women.jpg').transformation(Transformation()
	.resize(Resize.auto().width(300)
	.aspectRatio(
	AspectRatio.ar1X1())
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/street-women.jpg")
	 resize(Resize.auto() { width(300)
	 aspectRatio(
	AspectRatio.ar1X1())
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/street-women.jpg", {aspect_ratio: "1:1", width: 300, gravity: "face", crop: "auto"})
```

```react_native
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(ar1X1())
    .gravity(focusOn(face()))
);
```

Original

ar_1:1,w_300,c_auto,g_faceFocus on the largest face

Or, keep all the faces in the crop with `g_faces`:

![Keep all the faces](https://res.cloudinary.com/demo/image/upload/ar_1.75,w_300,c_auto,g_faces/docs/street-women.jpg "width:300")

```nodejs
cloudinary.image("docs/street-women.jpg", {aspect_ratio: "1.75", width: 300, gravity: "faces", crop: "auto"})
```

```react
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(1.75)
    .gravity(focusOn(faces()))
);
```

```vue
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(1.75)
    .gravity(focusOn(faces()))
);
```

```angular
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(1.75)
    .gravity(focusOn(faces()))
);
```

```js
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(1.75)
    .gravity(focusOn(faces()))
);
```

```python
CloudinaryImage("docs/street-women.jpg").image(aspect_ratio="1.75", width=300, gravity="faces", crop="auto")
```

```php
(new ImageTag('docs/street-women.jpg'))
	->resize(Resize::auto()->width(300)
->aspectRatio(1.75)
	->gravity(
	Gravity::focusOn(
	FocusOn::faces()))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.75").width(300).gravity("faces").crop("auto")).imageTag("docs/street-women.jpg");
```

```ruby
cl_image_tag("docs/street-women.jpg", aspect_ratio: "1.75", width: 300, gravity: "faces", crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.75").Width(300).Gravity("faces").Crop("auto")).BuildImageTag("docs/street-women.jpg")
```

```dart
cloudinary.image('docs/street-women.jpg').transformation(Transformation()
	.resize(Resize.auto().width(300)
.aspectRatio(1.75)
	.gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.75").setWidth(300).setGravity("faces").setCrop("auto")).generate("docs/street-women.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.75").width(300).gravity("faces").crop("auto")).generate("docs/street-women.jpg");
```

```flutter
cloudinary.image('docs/street-women.jpg').transformation(Transformation()
	.resize(Resize.auto().width(300)
.aspectRatio(1.75)
	.gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/street-women.jpg")
	 resize(Resize.auto() { width(300)
 aspectRatio(1.75F)
	 gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/street-women.jpg", {aspect_ratio: "1.75", width: 300, gravity: "faces", crop: "auto"})
```

```react_native
new CloudinaryImage("docs/street-women.jpg").resize(
  auto()
    .width(300)
    .aspectRatio(1.75)
    .gravity(focusOn(faces()))
);
```

Some of the special positions require add-ons, such as the [Advanced Facial Attributes Detection](advanced_facial_attributes_detection_addon) add-on to focus on the eyes in this case:

![Crop to the eyes](https://res.cloudinary.com/demo/image/upload/c_auto,g_adv_eyes,h_70,w_210/face_left.jpg "with_image: false")

```nodejs
cloudinary.image("face_left.jpg", {gravity: "adv_eyes", height: 70, width: 210, crop: "auto"})
```

```react
new CloudinaryImage("face_left.jpg").resize(
  auto()
    .width(210)
    .height(70)
    .gravity(focusOn(advancedEyes()))
);
```

```vue
new CloudinaryImage("face_left.jpg").resize(
  auto()
    .width(210)
    .height(70)
    .gravity(focusOn(advancedEyes()))
);
```

```angular
new CloudinaryImage("face_left.jpg").resize(
  auto()
    .width(210)
    .height(70)
    .gravity(focusOn(advancedEyes()))
);
```

```js
new CloudinaryImage("face_left.jpg").resize(
  auto()
    .width(210)
    .height(70)
    .gravity(focusOn(advancedEyes()))
);
```

```python
CloudinaryImage("face_left.jpg").image(gravity="adv_eyes", height=70, width=210, crop="auto")
```

```php
(new ImageTag('face_left.jpg'))
	->resize(Resize::auto()->width(210)
->height(70)
	->gravity(
	Gravity::focusOn(
	FocusOn::advancedEyes()))
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("adv_eyes").height(70).width(210).crop("auto")).imageTag("face_left.jpg");
```

```ruby
cl_image_tag("face_left.jpg", gravity: "adv_eyes", height: 70, width: 210, crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("adv_eyes").Height(70).Width(210).Crop("auto")).BuildImageTag("face_left.jpg")
```

```dart
cloudinary.image('face_left.jpg').transformation(Transformation()
	.resize(Resize.auto().width(210)
.height(70)
	.gravity(
	Gravity.focusOn(
	FocusOn.advancedEyes()))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("adv_eyes").setHeight(70).setWidth(210).setCrop("auto")).generate("face_left.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("adv_eyes").height(70).width(210).crop("auto")).generate("face_left.jpg");
```

```flutter
cloudinary.image('face_left.jpg').transformation(Transformation()
	.resize(Resize.auto().width(210)
.height(70)
	.gravity(
	Gravity.focusOn(
	FocusOn.advancedEyes()))
	));
```

```kotlin
cloudinary.image {
	publicId("face_left.jpg")
	 resize(Resize.auto() { width(210)
 height(70)
	 gravity(
	Gravity.focusOn(
	FocusOn.advancedEyes()))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("face_left.jpg", {gravity: "adv_eyes", height: 70, width: 210, crop: "auto"})
```

```react_native
new CloudinaryImage("face_left.jpg").resize(
  auto()
    .width(210)
    .height(70)
    .gravity(focusOn(advancedEyes()))
);
```

Original

c_auto,g_adv_eyes,h_70,w_210Focus on the eyes

For a full listing of the available gravity positions, see [special positions](transformation_reference#g_special_position) in the _Transformation URL API Reference_.

### Object positions
Using the [Cloudinary AI Content Analysis add-on](cloudinary_ai_content_analysis_addon), you can specify specific objects to focus on when cropping images. There are thousands of different supported objects that you can choose to focus on (see [Supported objects and categories](cloudinary_ai_content_analysis_addon#supported_objects_and_categories)). 
For example, crop this image to focus on the hat:

![Focus on the hat](https://res.cloudinary.com/demo/image/upload/ar_1:1,c_auto,g_hat,w_400/docs/clothing.jpg "with_image: false")

```nodejs
cloudinary.image("docs/clothing.jpg", {aspect_ratio: "1:1", gravity: "hat", width: 400, crop: "auto"})
```

```react
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(focusOn("hat"))
);
```

```vue
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(focusOn("hat"))
);
```

```angular
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(focusOn("hat"))
);
```

```js
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(focusOn("hat"))
);
```

```python
CloudinaryImage("docs/clothing.jpg").image(aspect_ratio="1:1", gravity="hat", width=400, crop="auto")
```

```php
(new ImageTag('docs/clothing.jpg'))
	->resize(Resize::auto()->width(400)
	->aspectRatio(
	AspectRatio::ar1X1())
	->gravity(
	Gravity::focusOn("hat"))
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1:1").gravity("hat").width(400).crop("auto")).imageTag("docs/clothing.jpg");
```

```ruby
cl_image_tag("docs/clothing.jpg", aspect_ratio: "1:1", gravity: "hat", width: 400, crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1:1").Gravity("hat").Width(400).Crop("auto")).BuildImageTag("docs/clothing.jpg")
```

```dart
cloudinary.image('docs/clothing.jpg').transformation(Transformation()
	.resize(Resize.auto().width(400)
	.aspectRatio(
	AspectRatio.ar1X1())
	.gravity(
	Gravity.focusOn("hat"))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1:1").setGravity("hat").setWidth(400).setCrop("auto")).generate("docs/clothing.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1:1").gravity("hat").width(400).crop("auto")).generate("docs/clothing.jpg");
```

```flutter
cloudinary.image('docs/clothing.jpg').transformation(Transformation()
	.resize(Resize.auto().width(400)
	.aspectRatio(
	AspectRatio.ar1X1())
	.gravity(
	Gravity.focusOn("hat"))
	));
```

```kotlin
cloudinary.image {
	publicId("docs/clothing.jpg")
	 resize(Resize.auto() { width(400)
	 aspectRatio(
	AspectRatio.ar1X1())
	 gravity(
	Gravity.focusOn("hat"))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/clothing.jpg", {aspect_ratio: "1:1", gravity: "hat", width: 400, crop: "auto"})
```

```react_native
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(focusOn("hat"))
);
```

Original

ar_1:1,c_auto,g_hat,w_400Focus on the hat

In this case, we've used the [auto](#c_auto) cropping mode, but you can also use object gravity with the [crop](#crop), [thumb](#thumb), [fill](#fill) and [lfill](#lfill_limit_fill) cropping modes.

### Liquid rescaling

Setting the `gravity` transformation parameter to `liquid`  (`g_liquid` in URLs), enables content-aware liquid rescaling (also sometimes known as 'seam carving'), which can be useful when changing the aspect ratio of an image. Normal scaling retains all image content even when aspect ratios change, so important elements of an image can be distorted. Liquid rescaling intelligently removes or duplicates 'seams' of pixels that may zig zag horizontally or vertically through the picture. The seams are determined using an algorithm that selects pixels with the least importance (least color change on either side of the seam). The result is an image where the most 'important' elements of the image are retained and generally do not appear distorted although the relative height or width of items in an image may change, especially if you significantly change the aspect ratio. 

Tips and guidelines for liquid gravity:

* It can be used only in conjunction with [c_scale](#scale).
* The `liquid` gravity works best when applied to scenic images with large 'unbusy' sections such as sky, grass, or water.
* It also works best when applied to larger images. Thus, it is recommended to use this gravity to change aspect ratio using relative widths and heights, where one of the two dimensions remains at or close to `1.0`. If you also want to resize the image, apply the resize on a different component of a chained transformation.
* In some cases, over-aggressive liquid rescaling can result in significant artifacts.

For example, using liquid scaling to change an image to a square (aspect ratio of 1:1) based on the original image width, and then resize the result to 500x500:

![Scale with liquid gravity](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_scale,g_liquid,w_1.0/c_scale,h_500,w_500/country_sunset.jpg "thumb: w_150, width:150")

```nodejs
cloudinary.image("country_sunset.jpg", {transformation: [
  {aspect_ratio: "1.0", gravity: "liquid", width: "1.0", crop: "scale"},
  {height: 500, width: 500, crop: "scale"}
  ]})
```

```react
new CloudinaryImage("country_sunset.jpg")
  .resize(scale().width("1.0").aspectRatio("1.0").liquidRescaling())
  .resize(scale().width(500).height(500));
```

```vue
new CloudinaryImage("country_sunset.jpg")
  .resize(scale().width("1.0").aspectRatio("1.0").liquidRescaling())
  .resize(scale().width(500).height(500));
```

```angular
new CloudinaryImage("country_sunset.jpg")
  .resize(scale().width("1.0").aspectRatio("1.0").liquidRescaling())
  .resize(scale().width(500).height(500));
```

```js
new CloudinaryImage("country_sunset.jpg")
  .resize(scale().width("1.0").aspectRatio("1.0").liquidRescaling())
  .resize(scale().width(500).height(500));
```

```python
CloudinaryImage("country_sunset.jpg").image(transformation=[
  {'aspect_ratio': "1.0", 'gravity': "liquid", 'width': "1.0", 'crop': "scale"},
  {'height': 500, 'width': 500, 'crop': "scale"}
  ])
```

```php
(new ImageTag('country_sunset.jpg'))
	->resize(Resize::scale()->width(1.0)
->aspectRatio(1.0)
->liquidRescaling())
	->resize(Resize::scale()->width(500)
->height(500));
```

```java
cloudinary.url().transformation(new Transformation()
  .aspectRatio("1.0").gravity("liquid").width(1.0).crop("scale").chain()
  .height(500).width(500).crop("scale")).imageTag("country_sunset.jpg");
```

```ruby
cl_image_tag("country_sunset.jpg", transformation: [
  {aspect_ratio: "1.0", gravity: "liquid", width: 1.0, crop: "scale"},
  {height: 500, width: 500, crop: "scale"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .AspectRatio("1.0").Gravity("liquid").Width(1.0).Crop("scale").Chain()
  .Height(500).Width(500).Crop("scale")).BuildImageTag("country_sunset.jpg")
```

```dart
cloudinary.image('country_sunset.jpg').transformation(Transformation()
	.resize(Resize.scale().width('1.0')
.aspectRatio('1.0')
.liquidRescaling())
	.resize(Resize.scale().width(500)
.height(500)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setAspectRatio("1.0").setGravity("liquid").setWidth(1.0).setCrop("scale").chain()
  .setHeight(500).setWidth(500).setCrop("scale")).generate("country_sunset.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .aspectRatio("1.0").gravity("liquid").width(1.0).crop("scale").chain()
  .height(500).width(500).crop("scale")).generate("country_sunset.jpg");
```

```flutter
cloudinary.image('country_sunset.jpg').transformation(Transformation()
	.resize(Resize.scale().width('1.0')
.aspectRatio('1.0')
.liquidRescaling())
	.resize(Resize.scale().width(500)
.height(500)));
```

```kotlin
cloudinary.image {
	publicId("country_sunset.jpg")
	 resize(Resize.scale() { width(1.0F)
 aspectRatio(1.0F)
 liquidRescaling() })
	 resize(Resize.scale() { width(500)
 height(500) }) 
}.generate()
```

```jquery
$.cloudinary.image("country_sunset.jpg", {transformation: [
  {aspect_ratio: "1.0", gravity: "liquid", width: "1.0", crop: "scale"},
  {height: 500, width: 500, crop: "scale"}
  ]})
```

```react_native
new CloudinaryImage("country_sunset.jpg")
  .resize(scale().width("1.0").aspectRatio("1.0").liquidRescaling())
  .resize(scale().width(500).height(500));
```

## Automatic gravity for crops (g_auto)
Cloudinary's intelligent gravity selection capabilities ensure that the most interesting areas of each image are selected as the main focus for the requested crop, not only for photos with faces, but for any content type. Each image is analyzed individually to find the optimal region to include while cropping. Automatically detected faces (or other elements) are, by default, given higher priority while analyzing the image content.
You apply automatic content-aware gravity by setting the `gravity` transformation parameter to `auto` (`g_auto` in URLs).

Here's an example of using automatic gravity when changing the aspect ratio of an image:

Original

c_fill,g_center,h_300,w_200Regular fill

c_fill,g_auto,h_300,w_200Automatic fill

![Automatic fill](https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,h_300,w_200/basketball_in_net.jpg "with_image: false")

```nodejs
cloudinary.image("basketball_in_net.jpg", {gravity: "auto", height: 300, width: 200, crop: "fill"})
```

```react
new CloudinaryImage("basketball_in_net.jpg").resize(
  fill()
    .width(200)
    .height(300)
    .gravity(autoGravity())
);
```

```vue
new CloudinaryImage("basketball_in_net.jpg").resize(
  fill()
    .width(200)
    .height(300)
    .gravity(autoGravity())
);
```

```angular
new CloudinaryImage("basketball_in_net.jpg").resize(
  fill()
    .width(200)
    .height(300)
    .gravity(autoGravity())
);
```

```js
new CloudinaryImage("basketball_in_net.jpg").resize(
  fill()
    .width(200)
    .height(300)
    .gravity(autoGravity())
);
```

```python
CloudinaryImage("basketball_in_net.jpg").image(gravity="auto", height=300, width=200, crop="fill")
```

```php
(new ImageTag('basketball_in_net.jpg'))
	->resize(Resize::fill()->width(200)
->height(300)
	->gravity(
	Gravity::autoGravity())
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto").height(300).width(200).crop("fill")).imageTag("basketball_in_net.jpg");
```

```ruby
cl_image_tag("basketball_in_net.jpg", gravity: "auto", height: 300, width: 200, crop: "fill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto").Height(300).Width(200).Crop("fill")).BuildImageTag("basketball_in_net.jpg")
```

```dart
cloudinary.image('basketball_in_net.jpg').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(300)
	.gravity(
	Gravity.autoGravity())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto").setHeight(300).setWidth(200).setCrop("fill")).generate("basketball_in_net.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto").height(300).width(200).crop("fill")).generate("basketball_in_net.jpg");
```

```flutter
cloudinary.image('basketball_in_net.jpg').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(300)
	.gravity(
	Gravity.autoGravity())
	));
```

```kotlin
cloudinary.image {
	publicId("basketball_in_net.jpg")
	 resize(Resize.fill() { width(200)
 height(300)
	 gravity(
	Gravity.autoGravity())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("basketball_in_net.jpg", {gravity: "auto", height: 300, width: 200, crop: "fill"})
```

```react_native
new CloudinaryImage("basketball_in_net.jpg").resize(
  fill()
    .width(200)
    .height(300)
    .gravity(autoGravity())
);
```

Automatic gravity for crops is supported for the [fill](#automatic_gravity_with_the_fill_mode), [lfill](#lfill_limit_fill), [fill_pad](#fill_pad), [thumb](#automatic_gravity_with_the_thumb_mode), [crop](#automatic_gravity_with_the_crop_mode) and [auto](#automatic_gravity_with_the_auto_cropping_mode) modes.

> **TIP**:
>
> :title=Notes and tips

> * Automatic gravity can be further qualified with various [focal gravity options](transformation_reference#g_auto), such as `g_auto:faces`. 

> * If [custom coordinates](custom_focus_areas#custom_coordinates) have been specified for an image (using the [Upload API](image_upload_api_reference) or the [Cloudinary Console](https://console.cloudinary.com/console)), the cropping or overlay will be based on that definition, taking the custom coordinates as-is and overriding the detection algorithm (the same as `g_custom`). This applies to all `focal_gravity` options except for `g_auto:custom_no_override`, `g_auto:aoi_<custom coordinates>` and `g_auto:none`.

> * You can add the [getinfo](transformation_reference#fl_get_info) flag (`fl_getinfo` in URLs) in your transformation to return the proposed `g_auto` cropping results in JSON instead of delivering the transformed image. You can then integrate the `g_auto` results into an external workflow, for example to display the proposed `g_auto` crop as the initial cropping suggestion in an external editing tool.

> * By default, `g_auto` applies an optimal combination of our AI and saliency-based algorithms to capture the best region to include in your cropped image. However, in certain situations you may want to explicitly request only one of the [automatic gravity algorithms](#selecting_a_single_automatic_gravity_algorithm) and/or adjust the default [focal preference](#adjusting_the_automatic_gravity_focal_preference) of the chosen algorithm. 

> * Automatic gravity is not supported for [animated images](animated_images). If `g_auto` is used in an animated image transformation, `center` gravity is applied, except when `c_fill_pad` is also specified, in which case an error is returned.  

> * By default, the automatic gravity algorithm uses the [rule of thirds](#the_rule_of_thirds) principle.  You can disable this if you want the focal point to be at the center of the image.

### Adjusting the automatic gravity focal preference

By default, both the saliency and subject automatic gravity algorithms give increased priority to detected `faces`. To adjust the focal preference of the automatic gravity algorithm, you can specify a different `focal_gravity` option. 

For example, if you are registered to the [Cloudinary AI Content Analysis add-on](cloudinary_ai_content_analysis_addon), you can instruct the gravity algorithm to give top priority to one or more specific objects or categories from an extensive list.

In this example, give top priority to any hat in the picture (`g_auto:hat`), while taking other elements of the picture into account (for example, the face):

![Use automatic crop with focus on the hat](https://res.cloudinary.com/demo/image/upload/ar_1:1,c_auto,g_auto:hat,w_400/docs/clothing.jpg "with_image: false")

```nodejs
cloudinary.image("docs/clothing.jpg", {aspect_ratio: "1:1", gravity: "auto:hat", width: 400, crop: "auto"})
```

```react
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(autoGravity().autoFocus(focusOn("hat")))
);
```

```vue
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(autoGravity().autoFocus(focusOn("hat")))
);
```

```angular
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(autoGravity().autoFocus(focusOn("hat")))
);
```

```js
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(autoGravity().autoFocus(focusOn("hat")))
);
```

```python
CloudinaryImage("docs/clothing.jpg").image(aspect_ratio="1:1", gravity="auto:hat", width=400, crop="auto")
```

```php
(new ImageTag('docs/clothing.jpg'))
	->resize(Resize::auto()->width(400)
	->aspectRatio(
	AspectRatio::ar1X1())
	->gravity(
	Gravity::autoGravity()
	->autoFocus(
	AutoFocus::focusOn("hat"))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1:1").gravity("auto:hat").width(400).crop("auto")).imageTag("docs/clothing.jpg");
```

```ruby
cl_image_tag("docs/clothing.jpg", aspect_ratio: "1:1", gravity: "auto:hat", width: 400, crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1:1").Gravity("auto:hat").Width(400).Crop("auto")).BuildImageTag("docs/clothing.jpg")
```

```dart
cloudinary.image('docs/clothing.jpg').transformation(Transformation()
	.resize(Resize.auto().width(400)
	.aspectRatio(
	AspectRatio.ar1X1())
	.gravity(
	Gravity.autoGravity()
	.autoFocus(
	AutoFocus.focusOn("hat"))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1:1").setGravity("auto:hat").setWidth(400).setCrop("auto")).generate("docs/clothing.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1:1").gravity("auto:hat").width(400).crop("auto")).generate("docs/clothing.jpg");
```

```flutter
cloudinary.image('docs/clothing.jpg').transformation(Transformation()
	.resize(Resize.auto().width(400)
	.aspectRatio(
	AspectRatio.ar1X1())
	.gravity(
	Gravity.autoGravity()
	.autoFocus(
	AutoFocus.focusOn("hat"))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("docs/clothing.jpg")
	 resize(Resize.auto() { width(400)
	 aspectRatio(
	AspectRatio.ar1X1())
	 gravity(
	Gravity.autoGravity() {
	 autoFocus(
	AutoFocus.focusOn("hat"))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/clothing.jpg", {aspect_ratio: "1:1", gravity: "auto:hat", width: 400, crop: "auto"})
```

```react_native
new CloudinaryImage("docs/clothing.jpg").resize(
  auto()
    .width(400)
    .aspectRatio(ar1X1())
    .gravity(autoGravity().autoFocus(focusOn("hat")))
);
```

Original

ar_1:1,c_auto,g_auto:hat,w_400Focus on the hat

> **TIP**: Compare this with the example in [Object positions](#object_positions).

The [OCR Text Detection and Extraction Add-on](ocr_text_detection_and_extraction_addon) lets you give a higher priority to text by setting the `gravity` qualifier to `auto:ocr_text`, while also giving priority to faces and other very prominent elements of an image.

![Use automatic crop with focus on the text](https://res.cloudinary.com/demo/image/upload/ar_1.1,c_crop,g_auto:ocr_text,w_300/home_4_sale.jpg "with_image: false")

```nodejs
cloudinary.image("home_4_sale.jpg", {aspect_ratio: "1.1", gravity: "auto:ocr_text", width: 300, crop: "crop"})
```

```react
new CloudinaryImage("home_4_sale.jpg").resize(
  crop()
    .width(300)
    .aspectRatio(1.1)
    .gravity(autoGravity().autoFocus(focusOn(ocr())))
);
```

```vue
new CloudinaryImage("home_4_sale.jpg").resize(
  crop()
    .width(300)
    .aspectRatio(1.1)
    .gravity(autoGravity().autoFocus(focusOn(ocr())))
);
```

```angular
new CloudinaryImage("home_4_sale.jpg").resize(
  crop()
    .width(300)
    .aspectRatio(1.1)
    .gravity(autoGravity().autoFocus(focusOn(ocr())))
);
```

```js
new CloudinaryImage("home_4_sale.jpg").resize(
  crop()
    .width(300)
    .aspectRatio(1.1)
    .gravity(autoGravity().autoFocus(focusOn(ocr())))
);
```

```python
CloudinaryImage("home_4_sale.jpg").image(aspect_ratio="1.1", gravity="auto:ocr_text", width=300, crop="crop")
```

```php
(new ImageTag('home_4_sale.jpg'))
	->resize(Resize::crop()->width(300)
->aspectRatio(1.1)
	->gravity(
	Gravity::autoGravity()
	->autoFocus(
	AutoFocus::focusOn(
	FocusOn::ocr()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation().aspectRatio("1.1").gravity("auto:ocr_text").width(300).crop("crop")).imageTag("home_4_sale.jpg");
```

```ruby
cl_image_tag("home_4_sale.jpg", aspect_ratio: "1.1", gravity: "auto:ocr_text", width: 300, crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().AspectRatio("1.1").Gravity("auto:ocr_text").Width(300).Crop("crop")).BuildImageTag("home_4_sale.jpg")
```

```dart
cloudinary.image('home_4_sale.jpg').transformation(Transformation()
	.resize(Resize.crop().width(300)
.aspectRatio(1.1)
	.gravity(
	Gravity.autoGravity()
	.autoFocus(
	AutoFocus.focusOn(
	FocusOn.ocr()))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setAspectRatio("1.1").setGravity("auto:ocr_text").setWidth(300).setCrop("crop")).generate("home_4_sale.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().aspectRatio("1.1").gravity("auto:ocr_text").width(300).crop("crop")).generate("home_4_sale.jpg");
```

```flutter
cloudinary.image('home_4_sale.jpg').transformation(Transformation()
	.resize(Resize.crop().width(300)
.aspectRatio(1.1)
	.gravity(
	Gravity.autoGravity()
	.autoFocus(
	AutoFocus.focusOn(
	FocusOn.ocr()))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("home_4_sale.jpg")
	 resize(Resize.crop() { width(300)
 aspectRatio(1.1F)
	 gravity(
	Gravity.autoGravity() {
	 autoFocus(
	AutoFocus.focusOn(
	FocusOn.ocr()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("home_4_sale.jpg", {aspect_ratio: "1.1", gravity: "auto:ocr_text", width: 300, crop: "crop"})
```

```react_native
new CloudinaryImage("home_4_sale.jpg").resize(
  crop()
    .width(300)
    .aspectRatio(1.1)
    .gravity(autoGravity().autoFocus(focusOn(ocr())))
);
```

Original

ar_1.1,c_crop,g_auto:ocr_text,w_300Focus on the text

For a complete list of all `focal_gravity` options, see the [g_\<special_position\>](transformation_reference#g_special_position) section of the _Transformation URL API Reference_.

### Automatic gravity with the fill mode

Use the `fill` mode with automatic gravity to keep most of the original image according to the requested dimensions of the derived image, ensuring that the most interesting regions of the original image are included in the resulting image.

Example of square aspect ratio cropping, regular vs. automatic:

Original

c_fill,g_center,h_200,w_200Regular fill

c_fill,g_auto,h_200,w_200Automatic fill

![Automatic fill](https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,h_200,w_200/face_left.jpg "with_image: false")

```nodejs
cloudinary.image("face_left.jpg", {gravity: "auto", height: 200, width: 200, crop: "fill"})
```

```react
new CloudinaryImage("face_left.jpg").resize(
  fill()
    .width(200)
    .height(200)
    .gravity(autoGravity())
);
```

```vue
new CloudinaryImage("face_left.jpg").resize(
  fill()
    .width(200)
    .height(200)
    .gravity(autoGravity())
);
```

```angular
new CloudinaryImage("face_left.jpg").resize(
  fill()
    .width(200)
    .height(200)
    .gravity(autoGravity())
);
```

```js
new CloudinaryImage("face_left.jpg").resize(
  fill()
    .width(200)
    .height(200)
    .gravity(autoGravity())
);
```

```python
CloudinaryImage("face_left.jpg").image(gravity="auto", height=200, width=200, crop="fill")
```

```php
(new ImageTag('face_left.jpg'))
	->resize(Resize::fill()->width(200)
->height(200)
	->gravity(
	Gravity::autoGravity())
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto").height(200).width(200).crop("fill")).imageTag("face_left.jpg");
```

```ruby
cl_image_tag("face_left.jpg", gravity: "auto", height: 200, width: 200, crop: "fill")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto").Height(200).Width(200).Crop("fill")).BuildImageTag("face_left.jpg")
```

```dart
cloudinary.image('face_left.jpg').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200)
	.gravity(
	Gravity.autoGravity())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto").setHeight(200).setWidth(200).setCrop("fill")).generate("face_left.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto").height(200).width(200).crop("fill")).generate("face_left.jpg");
```

```flutter
cloudinary.image('face_left.jpg').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200)
	.gravity(
	Gravity.autoGravity())
	));
```

```kotlin
cloudinary.image {
	publicId("face_left.jpg")
	 resize(Resize.fill() { width(200)
 height(200)
	 gravity(
	Gravity.autoGravity())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("face_left.jpg", {gravity: "auto", height: 200, width: 200, crop: "fill"})
```

```react_native
new CloudinaryImage("face_left.jpg").resize(
  fill()
    .width(200)
    .height(200)
    .gravity(autoGravity())
);
```

> **NOTE**: You can also use automatic gravity with the [lfill](#lfill_limit_fill) cropping mode.

### Automatic gravity with the thumb mode

Use the `thumb` mode with automatic gravity to apply more aggressive cropping than the [fill](#automatic_gravity_with_the_fill_mode) mode. This mode attempts to further zoom in and crop out less interesting image regions when relevant in order to include the most interesting objects in the resulting derived image. The automatic cropping algorithm decides whether and how aggressively to zoom-in and crop according to the content and cropping ratio of each image individually. A numerical value between 0 and 100 can be added to the `g_auto` parameter in order to advise the algorithm regarding the desired aggressiveness level (e.g., `g_auto:0` for the most aggressive thumb cropping).

Example of a square thumbnail, regular vs. automatic cropping:

Original

c_thumb,g_center Regular thumbnail   

c_thumb,g_auto Automatic thumbnail   

c_thumb,g_auto:0 Automatic thumbnail - most aggressive 

![Automatic thumb](https://res.cloudinary.com/demo/image/upload/c_thumb,g_auto:0,h_150,w_150/sunset_shoes.jpg "with_image: false")

```nodejs
cloudinary.image("sunset_shoes.jpg", {gravity: "auto:0", height: 150, width: 150, crop: "thumb"})
```

```react
new CloudinaryImage("sunset_shoes.jpg").addTransformation(
  "c_thumb,g_auto:0,h_150,w_150"
);
```

```vue
new CloudinaryImage("sunset_shoes.jpg").addTransformation(
  "c_thumb,g_auto:0,h_150,w_150"
);
```

```angular
new CloudinaryImage("sunset_shoes.jpg").addTransformation(
  "c_thumb,g_auto:0,h_150,w_150"
);
```

```js
new CloudinaryImage("sunset_shoes.jpg").addTransformation(
  "c_thumb,g_auto:0,h_150,w_150"
);
```

```python
CloudinaryImage("sunset_shoes.jpg").image(gravity="auto:0", height=150, width=150, crop="thumb")
```

```php
(new ImageTag('sunset_shoes.jpg'))
	->addTransformation("c_thumb,g_auto:0,h_150,w_150");
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto:0").height(150).width(150).crop("thumb")).imageTag("sunset_shoes.jpg");
```

```ruby
cl_image_tag("sunset_shoes.jpg", gravity: "auto:0", height: 150, width: 150, crop: "thumb")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto:0").Height(150).Width(150).Crop("thumb")).BuildImageTag("sunset_shoes.jpg")
```

```dart
cloudinary.image('sunset_shoes.jpg').transformation(Transformation()
	.addTransformation("c_thumb,g_auto:0,h_150,w_150"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto:0").setHeight(150).setWidth(150).setCrop("thumb")).generate("sunset_shoes.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto:0").height(150).width(150).crop("thumb")).generate("sunset_shoes.jpg");
```

```flutter
cloudinary.image('sunset_shoes.jpg').transformation(Transformation()
	.addTransformation("c_thumb,g_auto:0,h_150,w_150"));
```

```kotlin
cloudinary.image {
	publicId("sunset_shoes.jpg")
	 addTransformation("c_thumb,g_auto:0,h_150,w_150") 
}.generate()
```

```jquery
$.cloudinary.image("sunset_shoes.jpg", {gravity: "auto:0", height: 150, width: 150, crop: "thumb"})
```

```react_native
new CloudinaryImage("sunset_shoes.jpg").addTransformation(
  "c_thumb,g_auto:0,h_150,w_150"
);
```

> **NOTE**: The numeric value supplied for `auto` gravity together with `thumb` cropping indicates your preference for more or less aggressive zooming and the algorithm takes that preference into account. However, the automatic gravity algorithm may still determine that for a particular image and aspect ratio, its default zoom selection is the appropriate zoom for this image. In such a case, you may not see a difference between the default `g_auto` and `g_auto` with a specific aggressiveness level.

### Automatic gravity with the crop mode

Use the `crop` mode with automatic gravity to crop a region of exactly the specified dimensions out of the original image while automatically focusing on the most interesting region of the original image that fits within the required dimensions. The portion of the interesting area depends on the resolution of the original image. The `crop` mode is less useful than the [fill](#automatic_gravity_with_the_fill_mode), [lfill](#lfill_limit_fill), and [thumb](#automatic_gravity_with_the_thumb_mode) modes, as it is only practical to use when both the dimensions of the original image and the size of the interesting region are already known.

Example of a square crop, regular vs. auto cropping:

Original

c_crop,g_center Regular crop   

c_crop,g_auto Automatic crop   

![Automatic crop](https://res.cloudinary.com/demo/image/upload/c_crop,g_auto,h_250,w_200/docs/hot-air-balloons.jpg "with_image: false")

```nodejs
cloudinary.image("docs/hot-air-balloons.jpg", {gravity: "auto", height: 250, width: 200, crop: "crop"})
```

```react
new CloudinaryImage("docs/hot-air-balloons.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(autoGravity())
);
```

```vue
new CloudinaryImage("docs/hot-air-balloons.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(autoGravity())
);
```

```angular
new CloudinaryImage("docs/hot-air-balloons.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(autoGravity())
);
```

```js
new CloudinaryImage("docs/hot-air-balloons.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(autoGravity())
);
```

```python
CloudinaryImage("docs/hot-air-balloons.jpg").image(gravity="auto", height=250, width=200, crop="crop")
```

```php
(new ImageTag('docs/hot-air-balloons.jpg'))
	->resize(Resize::crop()->width(200)
->height(250)
	->gravity(
	Gravity::autoGravity())
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto").height(250).width(200).crop("crop")).imageTag("docs/hot-air-balloons.jpg");
```

```ruby
cl_image_tag("docs/hot-air-balloons.jpg", gravity: "auto", height: 250, width: 200, crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto").Height(250).Width(200).Crop("crop")).BuildImageTag("docs/hot-air-balloons.jpg")
```

```dart
cloudinary.image('docs/hot-air-balloons.jpg').transformation(Transformation()
	.resize(Resize.crop().width(200)
.height(250)
	.gravity(
	Gravity.autoGravity())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto").setHeight(250).setWidth(200).setCrop("crop")).generate("docs/hot-air-balloons.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto").height(250).width(200).crop("crop")).generate("docs/hot-air-balloons.jpg");
```

```flutter
cloudinary.image('docs/hot-air-balloons.jpg').transformation(Transformation()
	.resize(Resize.crop().width(200)
.height(250)
	.gravity(
	Gravity.autoGravity())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/hot-air-balloons.jpg")
	 resize(Resize.crop() { width(200)
 height(250)
	 gravity(
	Gravity.autoGravity())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/hot-air-balloons.jpg", {gravity: "auto", height: 250, width: 200, crop: "crop"})
```

```react_native
new CloudinaryImage("docs/hot-air-balloons.jpg").resize(
  crop()
    .width(200)
    .height(250)
    .gravity(autoGravity())
);
```

### Automatic gravity with the auto cropping mode

For maximum automation, use the automatic crop mode (`c_auto`) with automatic gravity (`g_auto`). This is less aggressive than [automatic gravity with the thumb mode](#automatic_gravity_with_the_thumb_mode), and is smarter about what to keep than [automatic gravity with the fill mode](#automatic_gravity_with_the_fill_mode).

![Automatic crop](https://res.cloudinary.com/demo/image/upload/c_scale,h_215/bo_1px_solid_grey/docs/handbag2.jpg "with_code: false, with_url: false, caption: Original")

c_fill,g_auto Fill crop   

c_thumb,g_auto Thumbnail crop   

c_auto,g_auto Automatic crop   

![Automatic crop](https://res.cloudinary.com/demo/image/upload/c_auto,g_auto,h_215,w_215/docs/handbag2.jpg "with_image: false")

```nodejs
cloudinary.image("docs/handbag2.jpg", {gravity: "auto", height: 215, width: 215, crop: "auto"})
```

```react
new CloudinaryImage("docs/handbag2.jpg").resize(
  auto()
    .width(215)
    .height(215)
    .gravity(autoGravity())
);
```

```vue
new CloudinaryImage("docs/handbag2.jpg").resize(
  auto()
    .width(215)
    .height(215)
    .gravity(autoGravity())
);
```

```angular
new CloudinaryImage("docs/handbag2.jpg").resize(
  auto()
    .width(215)
    .height(215)
    .gravity(autoGravity())
);
```

```js
new CloudinaryImage("docs/handbag2.jpg").resize(
  auto()
    .width(215)
    .height(215)
    .gravity(autoGravity())
);
```

```python
CloudinaryImage("docs/handbag2.jpg").image(gravity="auto", height=215, width=215, crop="auto")
```

```php
(new ImageTag('docs/handbag2.jpg'))
	->resize(Resize::auto()->width(215)
->height(215)
	->gravity(
	Gravity::autoGravity())
	);
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto").height(215).width(215).crop("auto")).imageTag("docs/handbag2.jpg");
```

```ruby
cl_image_tag("docs/handbag2.jpg", gravity: "auto", height: 215, width: 215, crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto").Height(215).Width(215).Crop("auto")).BuildImageTag("docs/handbag2.jpg")
```

```dart
cloudinary.image('docs/handbag2.jpg').transformation(Transformation()
	.resize(Resize.auto().width(215)
.height(215)
	.gravity(
	Gravity.autoGravity())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto").setHeight(215).setWidth(215).setCrop("auto")).generate("docs/handbag2.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto").height(215).width(215).crop("auto")).generate("docs/handbag2.jpg");
```

```flutter
cloudinary.image('docs/handbag2.jpg').transformation(Transformation()
	.resize(Resize.auto().width(215)
.height(215)
	.gravity(
	Gravity.autoGravity())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/handbag2.jpg")
	 resize(Resize.auto() { width(215)
 height(215)
	 gravity(
	Gravity.autoGravity())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/handbag2.jpg", {gravity: "auto", height: 215, width: 215, crop: "auto"})
```

```react_native
new CloudinaryImage("docs/handbag2.jpg").resize(
  auto()
    .width(215)
    .height(215)
    .gravity(autoGravity())
);
```

> **TIP**: Watch a [video tutorial](content_aware_image_cropping_tutorial) to learn more.

### The rule of thirds

The **rule of thirds** is a fundamental principle in photography and visual composition. It involves dividing an image into nine equal parts by two equally spaced horizontal lines and two equally spaced vertical lines. Key elements and points of interest in the scene are then positioned along these lines or at their intersections, rather than in the center of the frame. This technique helps create balance, draw the viewer's eye to important parts of the photo, and make the composition more dynamic and engaging.

By default, automatic gravity follows the rule of thirds principle. If you want to disable this functionality because you specifically want to center important elements, you can specify the `thirds_0` option for auto gravity (`g_auto:thirds_0` in URLs).

See the difference when cropping this image to a square:

Original

Default algorithm

Rule of thirds disabled

![Rule of thirds disabled](https://res.cloudinary.com/demo/image/upload/c_auto,g_auto:thirds_0,h_250,w_250/docs/girl-dress.jpg "with_image: false")

```nodejs
cloudinary.image("docs/girl-dress.jpg", {gravity: "auto:thirds_0", height: 250, width: 250, crop: "auto"})
```

```react
new CloudinaryImage("docs/girl-dress.jpg").addTransformation(
  "c_auto,g_auto:thirds_0,h_250,w_250"
);
```

```vue
new CloudinaryImage("docs/girl-dress.jpg").addTransformation(
  "c_auto,g_auto:thirds_0,h_250,w_250"
);
```

```angular
new CloudinaryImage("docs/girl-dress.jpg").addTransformation(
  "c_auto,g_auto:thirds_0,h_250,w_250"
);
```

```js
new CloudinaryImage("docs/girl-dress.jpg").addTransformation(
  "c_auto,g_auto:thirds_0,h_250,w_250"
);
```

```python
CloudinaryImage("docs/girl-dress.jpg").image(gravity="auto:thirds_0", height=250, width=250, crop="auto")
```

```php
(new ImageTag('docs/girl-dress.jpg'))
	->addTransformation("c_auto,g_auto:thirds_0,h_250,w_250");
```

```java
cloudinary.url().transformation(new Transformation().gravity("auto:thirds_0").height(250).width(250).crop("auto")).imageTag("docs/girl-dress.jpg");
```

```ruby
cl_image_tag("docs/girl-dress.jpg", gravity: "auto:thirds_0", height: 250, width: 250, crop: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Gravity("auto:thirds_0").Height(250).Width(250).Crop("auto")).BuildImageTag("docs/girl-dress.jpg")
```

```dart
cloudinary.image('docs/girl-dress.jpg').transformation(Transformation()
	.addTransformation("c_auto,g_auto:thirds_0,h_250,w_250"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setGravity("auto:thirds_0").setHeight(250).setWidth(250).setCrop("auto")).generate("docs/girl-dress.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().gravity("auto:thirds_0").height(250).width(250).crop("auto")).generate("docs/girl-dress.jpg");
```

```flutter
cloudinary.image('docs/girl-dress.jpg').transformation(Transformation()
	.addTransformation("c_auto,g_auto:thirds_0,h_250,w_250"));
```

```kotlin
cloudinary.image {
	publicId("docs/girl-dress.jpg")
	 addTransformation("c_auto,g_auto:thirds_0,h_250,w_250") 
}.generate()
```

```jquery
$.cloudinary.image("docs/girl-dress.jpg", {gravity: "auto:thirds_0", height: 250, width: 250, crop: "auto"})
```

```react_native
new CloudinaryImage("docs/girl-dress.jpg").addTransformation(
  "c_auto,g_auto:thirds_0,h_250,w_250"
);
```

### Selecting a single automatic gravity algorithm 

The default `g_auto` option applies an optimal mixture of two different methods of identifying the most important region of your image:

* **AI-based algorithm (subject)** - Uses deep-learning algorithms to identify the subjects of an image that are most likely to attract a person's gaze. 
* **Saliency algorithm (classic)** - Uses a combination of saliency heuristics, edge detection, light, skin-tone prioritization, and more to automatically detect and prioritize significant region(s) in the image.

In the majority of cases, the most salient elements in an image are also the main subjects of the photo, and thus both algorithms often produce very similar or identical results. However, in some cases, results can be somewhat different and therefore **the weighted mixture that `g_auto` applies by default usually gives the best results.**

But if you find that for the types of images you are delivering, one of the algorithms consistently gives a better result than the other, you can override the default combined mechanism and instead explicitly request your preferred algorithm by specifying `auto:subject` or `auto:classic` as the **gravity** value (`g_auto:subject` or `g_auto:classic` in URLs), with or without an additional [focal gravity](#adjusting_the_automatic_gravity_focal_preference) option. 

For example, when cropping the landscape image below to a portrait view, the classic algorithm selects the areas with the most graphically salient spots, which includes the colorful garden in the south east corner, while the subject algorithm focuses on the subjects that the AI-engine predicts are most likely to capture human attention, primarily the tower, cloud and fountains.

Original image

Default crop(Center gravity)

Auto-gravitySaliency (classic) method

Auto-gravityAI-based subject method

## Device Pixel Ratio (DPR) {anchor:set_device_pixel_ratio_dpr}

Different devices support different DPR values, which is defined as the ratio between physical pixels and logical pixels. This means that a device with support for a higher DPR uses more physical pixels for displaying an image, resulting in a clearer, sharper image.

Use the `dpr` parameter to set the DPR value of the delivered image. The parameter accepts a numeric  value specifying the DPR multiplier. 

The `dpr` parameter is especially useful when adding overlays, as you need the overlay image to be correctly resized according to the required pixel density of the device (along with the containing image). Setting the dpr transformation parameter applies the same resizing rules both to the containing image, and the included overlay.

For example, the following URL dynamically generates a square (100x100) version of an image named `pepper`, and adds another image named `sale_icon` as a semi-transparent watermark to the bottom right with a width of 50% relative to the pepper image. Setting the `dpr` value to 1.0, 2.0 (as in the code example) or 3.0 generates the following images, while resizing both the containing image *and the overlay* to match the required DPR.

[DPR 2.0 circular thumbnail with a watermark URL](https://res.cloudinary.com/demo/image/upload/c_fill,h_100,w_100/l_sale_icon/c_scale,fl_relative,w_0.5/o_60/e_brightness:100/fl_layer_apply,g_south_east/dpr_2.0/docs/pepper.jpg)

DPR 1.0

DPR 2.0

DPR 3.0

Now you can create a 100x100 HTML image tag and deliver an image with the resolution that best matches the specified pixel density of your users' devices. The three images below are all displayed within a 100x100 logical square using the `<img>` tag width and height attributes, while you see more details and a better visual result for the last two images if you view this documentation using a device that supports a higher DPR.

```html
<img src="https://res.cloudinary.com/demo/image/upload/c_fill,h_100,w_100/l_sale_icon/c_scale,w_50/o_60/e_brightness:100/fl_layer_apply,g_south_east/dpr_2.0/docs/pepper.jpg"
  height="100"
  width="100" />
```

DPR 1.0(100x100, 4.1KB)

DPR 2.0(200x200, 10.1KB) 

DPR 3.0(300x300, 22.3KB)

> **NOTE**: When setting a DPR value, you must also include a [crop/resize transformation](transformation_reference#c_crop_resize) specifying a certain width or height.
You can alternatively use `dpr_auto` to automatically deliver the best image, depending on the requesting device's support for DPR. For details, see the [Responsive images](responsive_images) documentation.  

**See full syntax**: [dpr (DPR)](transformation_reference#dpr_dpr) in the _Transformation Reference_.

## Upscaling with super resolution

Normally, when you upscale a small image, the image loses detail and quality.  Take, for example, this 200 x 303 pixel image of a hall:

![Original image of a hall](https://res.cloudinary.com/demo/image/upload/docs/tall-hall.jpg)

```nodejs
cloudinary.image("docs/tall-hall.jpg")
```

```react
new CloudinaryImage("docs/tall-hall.jpg");
```

```vue
new CloudinaryImage("docs/tall-hall.jpg");
```

```angular
new CloudinaryImage("docs/tall-hall.jpg");
```

```js
new CloudinaryImage("docs/tall-hall.jpg");
```

```python
CloudinaryImage("docs/tall-hall.jpg").image()
```

```php
(new ImageTag('docs/tall-hall.jpg'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("docs/tall-hall.jpg");
```

```ruby
cl_image_tag("docs/tall-hall.jpg")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("docs/tall-hall.jpg")
```

```dart
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("docs/tall-hall.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("docs/tall-hall.jpg");
```

```flutter
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("docs/tall-hall.jpg") 
}.generate()
```

```jquery
$.cloudinary.image("docs/tall-hall.jpg")
```

```react_native
new CloudinaryImage("docs/tall-hall.jpg");
```

If you upscale it to four times its dimensions using `c_scale,w_4.0`, this is the result:

![Image of a hall scaled up with the scale action](https://res.cloudinary.com/demo/image/upload/c_scale,w_4.0/docs/tall-hall.jpg)

```nodejs
cloudinary.image("docs/tall-hall.jpg", {width: "4.0", crop: "scale"})
```

```react
new CloudinaryImage("docs/tall-hall.jpg").resize(scale().width("4.0"));
```

```vue
new CloudinaryImage("docs/tall-hall.jpg").resize(scale().width("4.0"));
```

```angular
new CloudinaryImage("docs/tall-hall.jpg").resize(scale().width("4.0"));
```

```js
new CloudinaryImage("docs/tall-hall.jpg").resize(scale().width("4.0"));
```

```python
CloudinaryImage("docs/tall-hall.jpg").image(width="4.0", crop="scale")
```

```php
(new ImageTag('docs/tall-hall.jpg'))
	->resize(Resize::scale()->width(4.0));
```

```java
cloudinary.url().transformation(new Transformation().width(4.0).crop("scale")).imageTag("docs/tall-hall.jpg");
```

```ruby
cl_image_tag("docs/tall-hall.jpg", width: 4.0, crop: "scale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Width(4.0).Crop("scale")).BuildImageTag("docs/tall-hall.jpg")
```

```dart
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation()
	.resize(Resize.scale().width('4.0')));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setWidth(4.0).setCrop("scale")).generate("docs/tall-hall.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().width(4.0).crop("scale")).generate("docs/tall-hall.jpg");
```

```flutter
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation()
	.resize(Resize.scale().width('4.0')));
```

```kotlin
cloudinary.image {
	publicId("docs/tall-hall.jpg")
	 resize(Resize.scale() { width(4.0F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/tall-hall.jpg", {width: "4.0", crop: "scale"})
```

```react_native
new CloudinaryImage("docs/tall-hall.jpg").resize(scale().width("4.0"));
```

Using the generative AI [upscale effect](transformation_reference#e_upscale), you can retain much more detail for the same scaling factor:

![Image of a hall scaled up with the upscale effect](https://res.cloudinary.com/demo/image/upload/e_upscale/docs/tall-hall.jpg)

```nodejs
cloudinary.image("docs/tall-hall.jpg", {effect: "upscale"})
```

```react
new CloudinaryImage("docs/tall-hall.jpg").effect(upscale());
```

```vue
new CloudinaryImage("docs/tall-hall.jpg").effect(upscale());
```

```angular
new CloudinaryImage("docs/tall-hall.jpg").effect(upscale());
```

```js
new CloudinaryImage("docs/tall-hall.jpg").effect(upscale());
```

```python
CloudinaryImage("docs/tall-hall.jpg").image(effect="upscale")
```

```php
(new ImageTag('docs/tall-hall.jpg'))
	->effect(Effect::upscale());
```

```java
cloudinary.url().transformation(new Transformation().effect("upscale")).imageTag("docs/tall-hall.jpg");
```

```ruby
cl_image_tag("docs/tall-hall.jpg", effect: "upscale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("upscale")).BuildImageTag("docs/tall-hall.jpg")
```

```dart
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation()
	.effect(Effect.upscale()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("upscale")).generate("docs/tall-hall.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("upscale")).generate("docs/tall-hall.jpg");
```

```flutter
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation()
	.effect(Effect.upscale()));
```

```kotlin
cloudinary.image {
	publicId("docs/tall-hall.jpg")
	 effect(Effect.upscale()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/tall-hall.jpg", {effect: "upscale"})
```

```react_native
new CloudinaryImage("docs/tall-hall.jpg").effect(upscale());
```

The `upscale` effect scales each dimension by four, multiplying the total number of pixels by 16, and uses AI-based prediction to fill in the details. 

You can chain other transformations after the upscale, for example, creating a square image of the ceiling using the [fill](#fill) cropping mode, and switching it to grayscale:

![Fill crop chained after upscale](https://res.cloudinary.com/demo/image/upload/e_upscale/c_fill,w_400,h_400,g_north/e_grayscale/docs/tall-hall.jpg)

```nodejs
cloudinary.image("docs/tall-hall.jpg", {transformation: [
  {effect: "upscale"},
  {width: 400, height: 400, gravity: "north", crop: "fill"},
  {effect: "grayscale"}
  ]})
```

```react
new CloudinaryImage("docs/tall-hall.jpg")
  .effect(upscale())
  .resize(
    fill()
      .width(400)
      .height(400)
      .gravity(compass("north"))
  )
  .effect(grayscale());
```

```vue
new CloudinaryImage("docs/tall-hall.jpg")
  .effect(upscale())
  .resize(
    fill()
      .width(400)
      .height(400)
      .gravity(compass("north"))
  )
  .effect(grayscale());
```

```angular
new CloudinaryImage("docs/tall-hall.jpg")
  .effect(upscale())
  .resize(
    fill()
      .width(400)
      .height(400)
      .gravity(compass("north"))
  )
  .effect(grayscale());
```

```js
new CloudinaryImage("docs/tall-hall.jpg")
  .effect(upscale())
  .resize(
    fill()
      .width(400)
      .height(400)
      .gravity(compass("north"))
  )
  .effect(grayscale());
```

```python
CloudinaryImage("docs/tall-hall.jpg").image(transformation=[
  {'effect': "upscale"},
  {'width': 400, 'height': 400, 'gravity': "north", 'crop': "fill"},
  {'effect': "grayscale"}
  ])
```

```php
(new ImageTag('docs/tall-hall.jpg'))
	->effect(Effect::upscale())
	->resize(Resize::fill()->width(400)
->height(400)
	->gravity(
	Gravity::compass(
	Compass::north()))
	)
	->effect(Effect::grayscale());
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("upscale").chain()
  .width(400).height(400).gravity("north").crop("fill").chain()
  .effect("grayscale")).imageTag("docs/tall-hall.jpg");
```

```ruby
cl_image_tag("docs/tall-hall.jpg", transformation: [
  {effect: "upscale"},
  {width: 400, height: 400, gravity: "north", crop: "fill"},
  {effect: "grayscale"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("upscale").Chain()
  .Width(400).Height(400).Gravity("north").Crop("fill").Chain()
  .Effect("grayscale")).BuildImageTag("docs/tall-hall.jpg")
```

```dart
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation()
	.effect(Effect.upscale())
	.resize(Resize.fill().width(400)
.height(400)
	.gravity(
	Gravity.compass(
	Compass.north()))
	)
	.effect(Effect.grayscale()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("upscale").chain()
  .setWidth(400).setHeight(400).setGravity("north").setCrop("fill").chain()
  .setEffect("grayscale")).generate("docs/tall-hall.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("upscale").chain()
  .width(400).height(400).gravity("north").crop("fill").chain()
  .effect("grayscale")).generate("docs/tall-hall.jpg");
```

```flutter
cloudinary.image('docs/tall-hall.jpg').transformation(Transformation()
	.effect(Effect.upscale())
	.resize(Resize.fill().width(400)
.height(400)
	.gravity(
	Gravity.compass(
	Compass.north()))
	)
	.effect(Effect.grayscale()));
```

```kotlin
cloudinary.image {
	publicId("docs/tall-hall.jpg")
	 effect(Effect.upscale())
	 resize(Resize.fill() { width(400)
 height(400)
	 gravity(
	Gravity.compass(
	Compass.north()))
	 })
	 effect(Effect.grayscale()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/tall-hall.jpg", {transformation: [
  {effect: "upscale"},
  {width: 400, height: 400, gravity: "north", crop: "fill"},
  {effect: "grayscale"}
  ]})
```

```react_native
new CloudinaryImage("docs/tall-hall.jpg")
  .effect(upscale())
  .resize(
    fill()
      .width(400)
      .height(400)
      .gravity(compass("north"))
  )
  .effect(grayscale());
```
> **NOTES**:
>
> * To use the upscale effect, the input image must be smaller than 4.2 megapixels (the equivalent of 2048 x 2048 pixels).

> * There is a [special transformation count](transformation_counts#special_effect_calculations) for the upscale effect.

> * The upscale effect isn't supported for [animated](animated_images) images or [fetched](fetch_remote_images#fetch_and_deliver_remote_files) images.

> * When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](eager_and_incoming_transformations#eager_transformations).

> * When Cloudinary is generating an [incoming transformation](eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.
**See full syntax**: [e_upscale](transformation_reference#e_upscale) in the _Transformation Reference_.

**Try it out**: [Upscale](https://console.cloudinary.com/app/image/home/upscale?media=image&collection=signs&sample=me%2Fupscale-sign-1).

## Downscaling tips

When downscaling images, you may notice a reduction in image quality. Here are a few tips to help preserve more details. 

You can use the `sharpen` effect to add definition to your images. This effect can be used with any plan, and counts as one transformation.

![Photo of some denim with sharpen effect applied](https://res.cloudinary.com/demo/image/upload/c_scale,w_300/e_sharpen/docs/denim.jpg "with_image: false")

```nodejs
cloudinary.image("docs/denim.jpg", {transformation: [
  {width: 300, crop: "scale"},
  {effect: "sharpen"}
  ]})
```

```react
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .adjust(sharpen());
```

```vue
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .adjust(sharpen());
```

```angular
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .adjust(sharpen());
```

```js
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .adjust(sharpen());
```

```python
CloudinaryImage("docs/denim.jpg").image(transformation=[
  {'width': 300, 'crop': "scale"},
  {'effect': "sharpen"}
  ])
```

```php
(new ImageTag('docs/denim.jpg'))
	->resize(Resize::scale()->width(300))
	->adjust(Adjust::sharpen());
```

```java
cloudinary.url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .effect("sharpen")).imageTag("docs/denim.jpg");
```

```ruby
cl_image_tag("docs/denim.jpg", transformation: [
  {width: 300, crop: "scale"},
  {effect: "sharpen"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(300).Crop("scale").Chain()
  .Effect("sharpen")).BuildImageTag("docs/denim.jpg")
```

```dart
cloudinary.image('docs/denim.jpg').transformation(Transformation()
	.resize(Resize.scale().width(300))
	.adjust(Adjust.sharpen()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(300).setCrop("scale").chain()
  .setEffect("sharpen")).generate("docs/denim.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .effect("sharpen")).generate("docs/denim.jpg");
```

```flutter
cloudinary.image('docs/denim.jpg').transformation(Transformation()
	.resize(Resize.scale().width(300))
	.adjust(Adjust.sharpen()));
```

```kotlin
cloudinary.image {
	publicId("docs/denim.jpg")
	 resize(Resize.scale() { width(300) })
	 adjust(Adjust.sharpen()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/denim.jpg", {transformation: [
  {width: 300, crop: "scale"},
  {effect: "sharpen"}
  ]})
```

```react_native
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .adjust(sharpen());
```

  
  

Alternatively, you can take advantage of the generative AI effect, [generative restore](generative_ai_transformations#generative_restore), which also comes with any plan, but incurs a [higher transformation count](transformation_counts#effects_with_special_counts).

![Photo of some denim with generative restore effect applied](https://res.cloudinary.com/demo/image/upload/c_scale,w_300/e_gen_restore/docs/denim.jpg "with_image: false")

```nodejs
cloudinary.image("docs/denim.jpg", {transformation: [
  {width: 300, crop: "scale"},
  {effect: "gen_restore"}
  ]})
```

```react
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .effect(generativeRestore());
```

```vue
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .effect(generativeRestore());
```

```angular
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .effect(generativeRestore());
```

```js
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .effect(generativeRestore());
```

```python
CloudinaryImage("docs/denim.jpg").image(transformation=[
  {'width': 300, 'crop': "scale"},
  {'effect': "gen_restore"}
  ])
```

```php
(new ImageTag('docs/denim.jpg'))
	->resize(Resize::scale()->width(300))
	->effect(Effect::generativeRestore());
```

```java
cloudinary.url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .effect("gen_restore")).imageTag("docs/denim.jpg");
```

```ruby
cl_image_tag("docs/denim.jpg", transformation: [
  {width: 300, crop: "scale"},
  {effect: "gen_restore"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(300).Crop("scale").Chain()
  .Effect("gen_restore")).BuildImageTag("docs/denim.jpg")
```

```dart
cloudinary.image('docs/denim.jpg').transformation(Transformation()
	.resize(Resize.scale().width(300))
	.effect(Effect.generativeRestore()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(300).setCrop("scale").chain()
  .setEffect("gen_restore")).generate("docs/denim.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .effect("gen_restore")).generate("docs/denim.jpg");
```

```flutter
cloudinary.image('docs/denim.jpg').transformation(Transformation()
	.resize(Resize.scale().width(300))
	.effect(Effect.generativeRestore()));
```

```kotlin
cloudinary.image {
	publicId("docs/denim.jpg")
	 resize(Resize.scale() { width(300) })
	 effect(Effect.generativeRestore()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/denim.jpg", {transformation: [
  {width: 300, crop: "scale"},
  {effect: "gen_restore"}
  ]})
```

```react_native
new CloudinaryImage("docs/denim.jpg")
  .resize(scale().width(300))
  .effect(generativeRestore());
```

  
  

Our premium downscaling algorithm, which is available for select [Enterprise plans](https://cloudinary.com/pricing#pricing-enterprise), preserves more details by default, particularly at very low resolutions (less than 0.4 megapixels). You don't need to add any extra transformation parameters; it's applied as standard to any transformation that causes an image to be downscaled. It's great for small thumbnails, such as those used in product galleries. 

    
    

To give this a try, contact your Customer Success Manager or our [sales team](https://cloudinary.com/contact).

