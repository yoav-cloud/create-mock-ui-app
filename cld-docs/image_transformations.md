# Image transformations


Cloudinary's dynamic URL **transformations** enable you to programmatically generate multiple variations of your high quality original images on the fly, without the need for graphic designers and fancy editing tools. 

You can build these URLs manually in your code, or take advantage of [Cloudinary's SDKs](cloudinary_sdks), which enable you to write your transformation code using intuitive syntax designed for your preferred programming language or framework and let the SDK automatically build these URLs for you.
 

> **INFO**:
>
> Your account's pricing plan is in part dependent on the total number of **transformation operations** performed during a billing cycle. These are primarily counted when Cloudinary generates a new 'derived asset' from an asset based on a transformation URL. For complete details, see [How are transformations counted?](transformation_counts)

Here are just a few examples of some popular use cases that you can accomplish on the fly by combining Cloudinary transformations. Click each image to see the URL parameters applied in each case:

Convert format, round,change aspect ratio & crop to face,add outlines & shadows

Place, style, and formatimage and text layers

Apply special effects like cartoonify and brightness,rotate to any angle

&nbsp;

> **See also**:
>
> [Video Transformations](video_manipulation_and_delivery)

## Overview
Cloudinary allows you to easily transform your images on the fly to any required format, style and dimension, and apply effects and other visual enhancements. You can also optimize your images to deliver them with minimal file size alongside high visual quality for an improved user experience and minimal bandwidth. You can do all of this by implementing dynamic image transformation and delivery URLs. Your transformed images are then delivered to your users through a fast CDN with optimized caching. 
  
With image transformations, you can:

* Deliver images using the [image format](#image_format_support) that fits your needs.
* [Resize and crop](resizing_and_cropping) your images to the required dimensions using different scaling and cropping techniques, or use our smart cropping techniques, including [face-detection](face_detection_based_transformations) or [auto-gravity](resizing_and_cropping#automatic_cropping_g_auto) for cropping to focus on the most relevant parts of a photo.
* Generate a new image by [layering](layers) other images or text on your base image.
* Apply a variety of [effects, filters, and other visual enhancements](#effects_and_artistic_enhancements) to help your image achieve the desired impact.

> **READING**: :no-title
The rest of this page describes the basics of working with Cloudinary image transformations. 

The other pages in this guide provide details and use-case examples on the various types of image transformations you can apply to your images. 

The [Transformation URL API Reference](transformation_reference) details every transformation parameter available for both images and videos.
> **TIP**:
>
> :title=Tips

> * Usage limits for uploading, transforming and delivering files depend on your Cloudinary [plan](https://cloudinary.com/pricing). For details, check the **Account** tab in your Cloudinary Console **Settings**.

> * For additional information on how your overall account usage is calculated (including storage and bandwidth), see the [Cloudinary Pricing](https://cloudinary.com/pricing) page and this [KB article](https://support.cloudinary.com/hc/en-us/articles/203125631-How-does-Cloudinary-count-my-plan-s-quotas-and-what-does-every-quota-mean-).

> * You can set your email preferences to receive [notifications regarding your account usage](dam_admin_usage_data#usage_notifications). 

> * You can view an asset's derived assets from the **Derived Assets** tab of the Manage page in the Media Library. This can help you manage transformation usage, for example by reusing existing derived versions instead of generating new ones. For more information, see [Derived assets](media_library_for_developers) on the _Media Library for developers_ page.

  
### Quick example

Below you can see the transformation URL and corresponding SDK code for generating an image with several transformation parameters applied: 

* Scales and tightly crops the image to fit into a 200px x 200px square, centering on the auto-detected face: `/c_thumb,g_face,h_200,w_200/`
* Rounds the corners to a circle: `/r_max/`
* Converts and delivers the image in the best transparent format for the requesting browser. For example, webp or avif: `/f_auto/`

![Sample image using the crop, face detection, rounded corners and resize features](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_200,w_200/r_max/f_auto/woman-blackdress-stairs.png "with_image: false")

```nodejs
cloudinary.image("woman-blackdress-stairs.png", {transformation: [
  {gravity: "face", height: 200, width: 200, crop: "thumb"},
  {radius: "max"},
  {fetch_format: "auto"}
  ]})
```

```react
new CloudinaryImage("woman-blackdress-stairs.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .delivery(format(auto()));
```

```vue
new CloudinaryImage("woman-blackdress-stairs.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .delivery(format(auto()));
```

```angular
new CloudinaryImage("woman-blackdress-stairs.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .delivery(format(auto()));
```

```js
new CloudinaryImage("woman-blackdress-stairs.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .delivery(format(auto()));
```

```python
CloudinaryImage("woman-blackdress-stairs.png").image(transformation=[
  {'gravity': "face", 'height': 200, 'width': 200, 'crop': "thumb"},
  {'radius': "max"},
  {'fetch_format': "auto"}
  ])
```

```php
(new ImageTag('woman-blackdress-stairs.png'))
	->resize(Resize::thumbnail()->width(200)
->height(200)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	)
	->roundCorners(RoundCorners::max())
	->delivery(Delivery::format(
	Format::auto()));
```

```java
cloudinary.url().transformation(new Transformation()
  .gravity("face").height(200).width(200).crop("thumb").chain()
  .radius("max").chain()
  .fetchFormat("auto")).imageTag("woman-blackdress-stairs.png");
```

```ruby
cl_image_tag("woman-blackdress-stairs.png", transformation: [
  {gravity: "face", height: 200, width: 200, crop: "thumb"},
  {radius: "max"},
  {fetch_format: "auto"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Gravity("face").Height(200).Width(200).Crop("thumb").Chain()
  .Radius("max").Chain()
  .FetchFormat("auto")).BuildImageTag("woman-blackdress-stairs.png")
```

```dart
cloudinary.image('woman-blackdress-stairs.png').transformation(Transformation()
	.resize(Resize.thumbnail().width(200)
.height(200)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	)
	.roundCorners(RoundCorners.max())
	.delivery(Delivery.format(
	Format.auto())));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setGravity("face").setHeight(200).setWidth(200).setCrop("thumb").chain()
  .setRadius("max").chain()
  .setFetchFormat("auto")).generate("woman-blackdress-stairs.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .gravity("face").height(200).width(200).crop("thumb").chain()
  .radius("max").chain()
  .fetchFormat("auto")).generate("woman-blackdress-stairs.png");
```

```flutter
cloudinary.image('woman-blackdress-stairs.png').transformation(Transformation()
	.addTransformation("c_thumb,g_face,h_200,w_200/r_max/f_auto"));
```

```kotlin
cloudinary.image {
	publicId("woman-blackdress-stairs.png")
	 resize(Resize.thumbnail() { width(200)
 height(200)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 })
	 roundCorners(RoundCorners.max())
	 delivery(Delivery.format(
	Format.auto())) 
}.generate()
```

```jquery
$.cloudinary.image("woman-blackdress-stairs.png", {transformation: [
  {gravity: "face", height: 200, width: 200, crop: "thumb"},
  {radius: "max"},
  {fetch_format: "auto"}
  ]})
```

```react_native
new CloudinaryImage("woman-blackdress-stairs.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .delivery(format(auto()));
```

Original

&nbsp;

&nbsp;
&nbsp;

Transformed image

> **TIP**:
>
> You can use the [Media Library](media_library_for_developers) to preview and manage your transformations:

> * [Quickly test transformations](media_library_for_developers#quick_delivery_testing) in the Media Library by opening the image URL and manually adding transformations before implementing them programmatically.  

> * [Manage derived assets](media_library_for_developers#derived_assets) from the **Derived Assets** tab in an asset's Manage page.

## Transformation URL syntax
Your Cloudinary media assets are accessed using simple delivery HTTP or HTTPS URLs, which are then delivered to users via a worldwide fast CDN. The URL contains the **public ID** of the requested asset plus any optional transformation parameters. The public ID is the unique identifier of the asset and is either defined when uploading the asset to Cloudinary, or automatically assigned by Cloudinary (see [Uploading Assets](upload_parameters#public_id) for more details on the various options for specifying the public ID).

#### Generating transformation URLs with Cloudinary SDKs
Cloudinary's [SDKs](cloudinary_sdks) automatically build the transformation URL for you. They allow you to continue working in your preferred developer framework and also provide helper methods to simplify building image tags and image transformation URLs.> **TIP**: You can also create your transformation URLs using the [Transformation Builder](image_transformations#transformation_builder). Alternatively, you can take one of our transformations from the [Image Home Transformations Gallery](https://console.cloudinary.com/app/image/home) as a starting point and then further modify it in the Transformation Builder to fit your needs. The Transformation Builder generates the URL and SDK code for the transformation you define so that you can copy it in the language you require.

### Transformation URL structure
  The default Cloudinary asset delivery URL has the following structure:

  
    
      https://res.cloudinary.com/&lt;cloud_name&gt;/&lt;asset_type&gt;/&lt;delivery_type&gt;/&lt;transformations&gt;/&lt;version&gt;/&lt;public_id&gt;.&lt;extension&gt;
    
  

|element|description|
|---|---|
|cloud_name | A unique public identifier for your product environment, used for URL building and API access. **Note**: Paid customers on the [Advanced plan](https://cloudinary.com/pricing)  or higher can request to use a [private CDN or custom delivery hostname (CNAME)](advanced_url_delivery_options#private_cdns_and_custom_delivery_hostnames_cnames) to customize the domain name used for your delivery URLs. 
|asset_type | The type of asset to deliver. Valid values: `image`, `video`, or `raw`. The `image` type includes still image and photo formats, animated images, PDFs, layered files, such as TIFF and PSD, and others. The `video` type includes video and audio files. The `raw` type includes any file uploaded to Cloudinary that does not fit in one of the above categories. In general, transformations cannot be performed on `raw` assets, but they can be delivered as-is for download purposes, or in some cases, they may be used in conjunction with your image or video transformations.|
|delivery_type| The storage or delivery type. For details on all possible types, see [Delivery types](#delivery_types).|
| transformations| Optional. One or more comma-separated [transformation parameters](transformation_reference) in a single URL component, or a set of [chained transformations](#chained_transformations) in multiple URL components (separated by slashes). When the transformation URL is first accessed, the derived media file is created on the fly and delivered to your user. The derived file is also cached on the CDN and is immediately available to all subsequent users requesting the same asset. |
| version|Optional. You can include the version in your delivery URL to bypass the cached version on the CDN and force delivery of the latest asset (in the case that an asset has been overwritten with a newer file). For simplicity, the version component is generally not included in the example URLs on this page. For details, see [Asset versions](#asset_versions). |
| public_id| The unique identifier of the asset, including the [folder structure](upload_parameters#public_id) if relevant.|
| extension| Optional. The file extension of the requested delivery format for the asset. Default: The originally uploaded format or the format determined by [f_auto](#automatic_format_selection_f_auto), when used. |

In the most general case of simply delivering images that were uploaded to your Cloudinary product environment without any transformations, the delivery URL will be in the format:

<code>
https://res.cloudinary.com/\/image/upload/\\.\

For example, delivering the image with a public ID of: <code>leather_bag_gray, from the `demo` product environment in <code>jpg format:
  
![Sample image](https://res.cloudinary.com/demo/image/upload/leather_bag_gray.jpg "thumb: w_500")

```nodejs
cloudinary.image("leather_bag_gray.jpg")
```

```react
new CloudinaryImage("leather_bag_gray.jpg");
```

```vue
new CloudinaryImage("leather_bag_gray.jpg");
```

```angular
new CloudinaryImage("leather_bag_gray.jpg");
```

```js
new CloudinaryImage("leather_bag_gray.jpg");
```

```python
CloudinaryImage("leather_bag_gray.jpg").image()
```

```php
(new ImageTag('leather_bag_gray.jpg'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("leather_bag_gray.jpg");
```

```ruby
cl_image_tag("leather_bag_gray.jpg")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("leather_bag_gray.jpg")
```

```dart
cloudinary.image('leather_bag_gray.jpg').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("leather_bag_gray.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("leather_bag_gray.jpg");
```

```flutter
cloudinary.image('leather_bag_gray.jpg').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("leather_bag_gray.jpg") 
}.generate()
```

```jquery
$.cloudinary.image("leather_bag_gray.jpg")
```

```react_native
new CloudinaryImage("leather_bag_gray.jpg");
```
![Sample video](https://res.cloudinary.com/demo/video/upload/glide-over-coastal-beach.mp4 "thumb: w_500")

```nodejs
cloudinary.video("glide-over-coastal-beach")
```

```react
new CloudinaryVideo("glide-over-coastal-beach.mp4");
```

```vue
new CloudinaryVideo("glide-over-coastal-beach.mp4");
```

```angular
new CloudinaryVideo("glide-over-coastal-beach.mp4");
```

```js
new CloudinaryVideo("glide-over-coastal-beach.mp4");
```

```python
CloudinaryVideo("glide-over-coastal-beach").video()
```

```php
(new VideoTag('glide-over-coastal-beach.mp4'));
```

```java
cloudinary.url().transformation(new Transformation().videoTag("glide-over-coastal-beach");
```

```ruby
cl_video_tag("glide-over-coastal-beach")
```

```csharp
cloudinary.Api.UrlVideoUp.BuildVideoTag("glide-over-coastal-beach")
```

```dart
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation());
```

```swift
cloudinary.createUrl().setResourceType("video").generate("glide-over-coastal-beach.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().resourceType("video").generate("glide-over-coastal-beach.mp4");
```

```flutter
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation());
```

```kotlin
cloudinary.video {
	publicId("glide-over-coastal-beach.mp4") 
}.generate()
```

```jquery
$.cloudinary.video("glide-over-coastal-beach")
```

```react_native
new CloudinaryVideo("glide-over-coastal-beach.mp4");
```
  

The following shows an example of delivering the same image, this time with transformation parameters applied, so that the image is scaled down and then cropped to fill a 250px square (aspect ratio of 1:1 = 1.0) and then a light blue border is applied:
  
![Image cropped to 250*250px](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue/leather_bag_gray.jpg)

```nodejs
cloudinary.image("leather_bag_gray.jpg", {transformation: [
  {aspect_ratio: "1.0", height: 250, crop: "fill"},
  {border: "5px_solid_lightblue"}
  ]})
```

```react
new CloudinaryImage("leather_bag_gray.jpg")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```vue
new CloudinaryImage("leather_bag_gray.jpg")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```angular
new CloudinaryImage("leather_bag_gray.jpg")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```js
new CloudinaryImage("leather_bag_gray.jpg")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```python
CloudinaryImage("leather_bag_gray.jpg").image(transformation=[
  {'aspect_ratio': "1.0", 'height': 250, 'crop': "fill"},
  {'border': "5px_solid_lightblue"}
  ])
```

```php
(new ImageTag('leather_bag_gray.jpg'))
	->resize(Resize::fill()->height(250)
->aspectRatio(1.0))
	->border(Border::solid(5,Color::LIGHTBLUE));
```

```java
cloudinary.url().transformation(new Transformation()
  .aspectRatio("1.0").height(250).crop("fill").chain()
  .border("5px_solid_lightblue")).imageTag("leather_bag_gray.jpg");
```

```ruby
cl_image_tag("leather_bag_gray.jpg", transformation: [
  {aspect_ratio: "1.0", height: 250, crop: "fill"},
  {border: "5px_solid_lightblue"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .AspectRatio("1.0").Height(250).Crop("fill").Chain()
  .Border("5px_solid_lightblue")).BuildImageTag("leather_bag_gray.jpg")
```

```dart
cloudinary.image('leather_bag_gray.jpg').transformation(Transformation()
	.resize(Resize.fill().height(250)
.aspectRatio('1.0'))
	.border(Border.solid(5,Color.LIGHTBLUE)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setAspectRatio("1.0").setHeight(250).setCrop("fill").chain()
  .setBorder("5px_solid_lightblue")).generate("leather_bag_gray.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .aspectRatio("1.0").height(250).crop("fill").chain()
  .border("5px_solid_lightblue")).generate("leather_bag_gray.jpg");
```

```flutter
cloudinary.image('leather_bag_gray.jpg').transformation(Transformation()
	.resize(Resize.fill().height(250)
.aspectRatio('1.0'))
	.border(Border.solid(5,Color.LIGHTBLUE)));
```

```kotlin
cloudinary.image {
	publicId("leather_bag_gray.jpg")
	 resize(Resize.fill() { height(250)
 aspectRatio(1.0F) })
	 border(Border.solid(5,Color.LIGHTBLUE)) 
}.generate()
```

```jquery
$.cloudinary.image("leather_bag_gray.jpg", {transformation: [
  {aspect_ratio: "1.0", height: 250, crop: "fill"},
  {border: "5px_solid_lightblue"}
  ]})
```

```react_native
new CloudinaryImage("leather_bag_gray.jpg")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```
![Video cropped to 250*250px](https://res.cloudinary.com/demo/video/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue/glide-over-coastal-beach.mp4)

```nodejs
cloudinary.video("glide-over-coastal-beach", {transformation: [
  {aspect_ratio: "1.0", height: 250, crop: "fill"},
  {border: "5px_solid_lightblue"}
  ]})
```

```react
new CloudinaryVideo("glide-over-coastal-beach.mp4")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```vue
new CloudinaryVideo("glide-over-coastal-beach.mp4")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```angular
new CloudinaryVideo("glide-over-coastal-beach.mp4")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```js
new CloudinaryVideo("glide-over-coastal-beach.mp4")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

```python
CloudinaryVideo("glide-over-coastal-beach").video(transformation=[
  {'aspect_ratio': "1.0", 'height': 250, 'crop': "fill"},
  {'border': "5px_solid_lightblue"}
  ])
```

```php
(new VideoTag('glide-over-coastal-beach.mp4'))
	->resize(Resize::fill()->height(250)
->aspectRatio(1.0))
	->border(Border::solid(5,Color::LIGHTBLUE));
```

```java
cloudinary.url().transformation(new Transformation()
  .aspectRatio("1.0").height(250).crop("fill").chain()
  .border("5px_solid_lightblue")).videoTag("glide-over-coastal-beach");
```

```ruby
cl_video_tag("glide-over-coastal-beach", transformation: [
  {aspect_ratio: "1.0", height: 250, crop: "fill"},
  {border: "5px_solid_lightblue"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .AspectRatio("1.0").Height(250).Crop("fill").Chain()
  .Border("5px_solid_lightblue")).BuildVideoTag("glide-over-coastal-beach")
```

```dart
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation()
	.resize(Resize.fill().height(250)
.aspectRatio('1.0'))
	.border(Border.solid(5,Color.LIGHTBLUE)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setAspectRatio("1.0").setHeight(250).setCrop("fill").chain()
  .setBorder("5px_solid_lightblue")).generate("glide-over-coastal-beach.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .aspectRatio("1.0").height(250).crop("fill").chain()
  .border("5px_solid_lightblue")).resourceType("video").generate("glide-over-coastal-beach.mp4");
```

```flutter
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation()
	.resize(Resize.fill().height(250)
.aspectRatio('1.0'))
	.border(Border.solid(5,Color.LIGHTBLUE)));
```

```kotlin
cloudinary.video {
	publicId("glide-over-coastal-beach.mp4")
	 resize(Resize.fill() { height(250)
 aspectRatio(1.0F) })
	 border(Border.solid(5,Color.LIGHTBLUE)) 
}.generate()
```

```jquery
$.cloudinary.video("glide-over-coastal-beach", {transformation: [
  {aspect_ratio: "1.0", height: 250, crop: "fill"},
  {border: "5px_solid_lightblue"}
  ]})
```

```react_native
new CloudinaryVideo("glide-over-coastal-beach.mp4")
  .resize(fill().height(250).aspectRatio("1.0"))
  .border(solid(5, "lightblue"));
```

#### Transformation URL tips

* For customers with a [Custom delivery hostname (CNAME)](advanced_url_delivery_options#private_cdns_and_custom_delivery_hostnames_cnames) - available for Cloudinary's Advanced plan and above - the basic image  delivery URL becomes: <code>https://\/image/upload....
* You can convert and deliver your image in other supported image formats by simply changing the image format file extension. For details, see [Delivering in a different format](#delivering_in_a_different_format).
* You can append an SEO-friendly suffix to your URL by replacing the <code>image/upload element of the URL with <code>images and then appending the desired suffix with a slash (/) after the public ID and before the extension. For example, if you have a cooking image with a random public ID like: `abc1def2`, you can deliver your image as:<code>https://res.cloudinary.com/\/images/upload/a12345/cooking\.jpg For more details, see [Dynamic SEO suffixes](advanced_url_delivery_options#dynamic_seo_suffixes).

[//]: # (this bullet is an additional image bullet within the transformation URL tips from the above partial)
* You can also use shortcut URLs when specifically delivering image files using the default `upload` type. With Cloudinary's [Root Path URL](advanced_url_delivery_options#root_path_urls) feature, the `<asset_type>` and `<delivery_type>` elements can be omitted from the URL (they automatically default to the values `image` and `upload` respectively). For example, the Root Path shortcut delivery URL for the cropped image above is:

    `https://res.cloudinary.com/demo/c_crop,h_200,w_300/sample.jpg`

#### Transformation URL video tutorial
[//]: # (identical video tutorial in vid_manip_and_deliv file, not worth another partial - if change here, change there too)
The following video provides a quick demonstration of how dynamic transformation URLs work with both images and videos.

  This video is brought to you by Cloudinary's video player - embed your own!Use the controls to set the playback speed, navigate to chapters of interest and select subtitles in your preferred language.

#### Tutorial contents This tutorial presents the following topics. Click a timestamp to jump to that part of the video.
##### Transform assets on the fly
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media :min=0 :sec=14 :player=cld} |When you upload your images and videos to Cloudinary, you can access them using a URL. You can apply a transformation to your assets on the fly by adding a set of [transformation parameters](transformation_reference) into the [URL](image_transformations#transforming_media_assets_using_dynamic_urls). A transformation can change many things about the asset, including its color, brightness, angle and border, plus, amongst others, duration speed and volume for videos. Transformations are also used for optimization, reducing size, changing formats and applying compression.|

##### Apply transformations to an image
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media :min=0 :sec=55 :player=cld} | To resize an image on the fly you can use the `ar_` parameter to change the aspect ratio (`ar_2:3`) and the `w_` parameter to change the width (`w_500`). To avoid squashing the image, use the `c_fill` parameter. Use automatic gravity (`g_auto`) to let Cloudinary AI decide what to focus on, rather than the center of the image.  Here's the whole transformation: `ar_2:3,c_fill,g_auto,w_500`.|

##### Chaining transformations
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media :min=1 :sec=39 :player=cld} | You can chain transformations together in separate components, separated by a forward slash. For example, use the generative remove effect to remove the dog's tail by adding the `e_gen_remove` parameter (`e_gen_remove:prompt_tail\ar_2:3,c_fill,g_auto,w_500`). Each chained component applies its action to the result of the previous one.|

![Chained transformation](https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_tail/ar_2:3,c_fill,g_auto,w_500/e_grayscale/bo_15px_solid_brown,r_30/b_black/co_brown,l_text:great%20vibes_52:Wish%20you%20were%20here.../fl_layer_apply,g_north,y_60/a_-5/docs/family-beach.png "thumb: c_scale,w_200")

```nodejs
cloudinary.image("docs/family-beach.png", {transformation: [
  {effect: "gen_remove:prompt_tail"},
  {aspect_ratio: "2:3", gravity: "auto", width: 500, crop: "fill"},
  {effect: "grayscale"},
  {border: "15px_solid_brown", radius: 30},
  {background: "black"},
  {color: "brown", overlay: {font_family: "vibes", font_size: 52, text: "Wish%20you%20were%20here..."}},
  {flags: "layer_apply", gravity: "north", y: 60},
  {angle: -5}
  ]})
```

```react
new CloudinaryImage("docs/family-beach.png")
  .effect(generativeRemove().prompt("tail"))
  .resize(
    fill()
      .width(500)
      .aspectRatio("2:3")
      .gravity(autoGravity())
  )
  .effect(grayscale())
  .border(solid(15, "brown").roundCorners(byRadius(30)))
  .backgroundColor("black")
  .overlay(
    source(
      text("Wish you were here...", new TextStyle("great vibes", 52)).textColor(
        "brown"
      )
    ).position(
      new Position()
        .gravity(compass("north"))
        .offsetY(60)
    )
  )
  .rotate(byAngle(-5));
```

```vue
new CloudinaryImage("docs/family-beach.png")
  .effect(generativeRemove().prompt("tail"))
  .resize(
    fill()
      .width(500)
      .aspectRatio("2:3")
      .gravity(autoGravity())
  )
  .effect(grayscale())
  .border(solid(15, "brown").roundCorners(byRadius(30)))
  .backgroundColor("black")
  .overlay(
    source(
      text("Wish you were here...", new TextStyle("great vibes", 52)).textColor(
        "brown"
      )
    ).position(
      new Position()
        .gravity(compass("north"))
        .offsetY(60)
    )
  )
  .rotate(byAngle(-5));
```

```angular
new CloudinaryImage("docs/family-beach.png")
  .effect(generativeRemove().prompt("tail"))
  .resize(
    fill()
      .width(500)
      .aspectRatio("2:3")
      .gravity(autoGravity())
  )
  .effect(grayscale())
  .border(solid(15, "brown").roundCorners(byRadius(30)))
  .backgroundColor("black")
  .overlay(
    source(
      text("Wish you were here...", new TextStyle("great vibes", 52)).textColor(
        "brown"
      )
    ).position(
      new Position()
        .gravity(compass("north"))
        .offsetY(60)
    )
  )
  .rotate(byAngle(-5));
```

```js
new CloudinaryImage("docs/family-beach.png")
  .effect(generativeRemove().prompt("tail"))
  .resize(
    fill()
      .width(500)
      .aspectRatio("2:3")
      .gravity(autoGravity())
  )
  .effect(grayscale())
  .border(solid(15, "brown").roundCorners(byRadius(30)))
  .backgroundColor("black")
  .overlay(
    source(
      text("Wish you were here...", new TextStyle("great vibes", 52)).textColor(
        "brown"
      )
    ).position(
      new Position()
        .gravity(compass("north"))
        .offsetY(60)
    )
  )
  .rotate(byAngle(-5));
```

```python
CloudinaryImage("docs/family-beach.png").image(transformation=[
  {'effect': "gen_remove:prompt_tail"},
  {'aspect_ratio': "2:3", 'gravity': "auto", 'width': 500, 'crop': "fill"},
  {'effect': "grayscale"},
  {'border': "15px_solid_brown", 'radius': 30},
  {'background': "black"},
  {'color': "brown", 'overlay': {'font_family': "vibes", 'font_size': 52, 'text': "Wish%20you%20were%20here..."}},
  {'flags': "layer_apply", 'gravity': "north", 'y': 60},
  {'angle': -5}
  ])
```

```php
(new ImageTag('docs/family-beach.png'))
	->effect(Effect::generativeRemove()->prompt("tail"))
	->resize(Resize::fill()->width(500)
->aspectRatio("2:3")
	->gravity(
	Gravity::autoGravity())
	)
	->effect(Effect::grayscale())
	->border(Border::solid(15,Color::BROWN)
	->roundCorners(
	RoundCorners::byRadius(30))
	)
	->backgroundColor(Color::BLACK)
	->overlay(Overlay::source(
	Source::text("Wish you were here...",(new TextStyle("great vibes",52)))
	->textColor(Color::BROWN)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::north()))
->offsetY(60))
	)
	->rotate(Rotate::byAngle(-5));
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("gen_remove:prompt_tail").chain()
  .aspectRatio("2:3").gravity("auto").width(500).crop("fill").chain()
  .effect("grayscale").chain()
  .border("15px_solid_brown").radius(30).chain()
  .background("black").chain()
  .color("brown").overlay(new TextLayer().fontFamily("vibes").fontSize(52).text("Wish%20you%20were%20here...")).chain()
  .flags("layer_apply").gravity("north").y(60).chain()
  .angle(-5)).imageTag("docs/family-beach.png");
```

```ruby
cl_image_tag("docs/family-beach.png", transformation: [
  {effect: "gen_remove:prompt_tail"},
  {aspect_ratio: "2:3", gravity: "auto", width: 500, crop: "fill"},
  {effect: "grayscale"},
  {border: "15px_solid_brown", radius: 30},
  {background: "black"},
  {color: "brown", overlay: {font_family: "vibes", font_size: 52, text: "Wish%20you%20were%20here..."}},
  {flags: "layer_apply", gravity: "north", y: 60},
  {angle: -5}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("gen_remove:prompt_tail").Chain()
  .AspectRatio("2:3").Gravity("auto").Width(500).Crop("fill").Chain()
  .Effect("grayscale").Chain()
  .Border("15px_solid_brown").Radius(30).Chain()
  .Background("black").Chain()
  .Color("brown").Overlay(new TextLayer().FontFamily("vibes").FontSize(52).Text("Wish%20you%20were%20here...")).Chain()
  .Flags("layer_apply").Gravity("north").Y(60).Chain()
  .Angle(-5)).BuildImageTag("docs/family-beach.png")
```

```dart
cloudinary.image('docs/family-beach.png').transformation(Transformation()
	.addTransformation("e_gen_remove:prompt_tail/ar_2:3,c_fill,g_auto,w_500/e_grayscale/bo_15px_solid_brown,r_30/b_black/co_brown,l_text:great vibes_52:Wish you were here.../fl_layer_apply,g_north,y_60/a_-5"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("gen_remove:prompt_tail").chain()
  .setAspectRatio("2:3").setGravity("auto").setWidth(500).setCrop("fill").chain()
  .setEffect("grayscale").chain()
  .setBorder("15px_solid_brown").setRadius(30).chain()
  .setBackground("black").chain()
  .setColor("brown").setOverlay("text:great%20vibes_52:Wish%20you%20were%20here...").chain()
  .setFlags("layer_apply").setGravity("north").setY(60).chain()
  .setAngle(-5)).generate("docs/family-beach.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("gen_remove:prompt_tail").chain()
  .aspectRatio("2:3").gravity("auto").width(500).crop("fill").chain()
  .effect("grayscale").chain()
  .border("15px_solid_brown").radius(30).chain()
  .background("black").chain()
  .color("brown").overlay(new TextLayer().fontFamily("vibes").fontSize(52).text("Wish%20you%20were%20here...")).chain()
  .flags("layer_apply").gravity("north").y(60).chain()
  .angle(-5)).generate("docs/family-beach.png");
```

```flutter
cloudinary.image('docs/family-beach.png').transformation(Transformation()
	.addTransformation("e_gen_remove:prompt_tail/ar_2:3,c_fill,g_auto,w_500/e_grayscale/bo_15px_solid_brown,r_30/b_black/co_brown,l_text:great vibes_52:Wish you were here.../fl_layer_apply,g_north,y_60/a_-5"));
```

```kotlin
cloudinary.image {
	publicId("docs/family-beach.png")
	 effect(Effect.generativeRemove() { prompt("tail") })
	 resize(Resize.fill() { width(500)
 aspectRatio("2:3")
	 gravity(
	Gravity.autoGravity())
	 })
	 effect(Effect.grayscale())
	 border(Border.solid(15,Color.BROWN) {
	 roundCorners(
	RoundCorners.byRadius(30))
	 })
	 backgroundColor(Color.BLACK)
	 overlay(Overlay.source(
	Source.text("Wish you were here...",TextStyle("great vibes",52)) {
	 textColor(Color.BROWN)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.north()))
 offsetY(60) })
	 })
	 rotate(Rotate.byAngle(-5)) 
}.generate()
```

```jquery
$.cloudinary.image("docs/family-beach.png", {transformation: [
  {effect: "gen_remove:prompt_tail"},
  {aspect_ratio: "2:3", gravity: "auto", width: 500, crop: "fill"},
  {effect: "grayscale"},
  {border: "15px_solid_brown", radius: 30},
  {background: "black"},
  {color: "brown", overlay: new cloudinary.TextLayer().fontFamily("vibes").fontSize(52).text("Wish%20you%20were%20here...")},
  {flags: "layer_apply", gravity: "north", y: 60},
  {angle: -5}
  ]})
```

```react_native
new CloudinaryImage("docs/family-beach.png")
  .effect(generativeRemove().prompt("tail"))
  .resize(
    fill()
      .width(500)
      .aspectRatio("2:3")
      .gravity(autoGravity())
  )
  .effect(grayscale())
  .border(solid(15, "brown").roundCorners(byRadius(30)))
  .backgroundColor("black")
  .overlay(
    source(
      text("Wish you were here...", new TextStyle("great vibes", 52)).textColor(
        "brown"
      )
    ).position(
      new Position()
        .gravity(compass("north"))
        .offsetY(60)
    )
  )
  .rotate(byAngle(-5));
```

##### Apply transformations to a video
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media :min=2 :sec=27 :player=cld} | You can apply transformations to videos in the same way. Here's an example of a text overlay. Use the `l_` parameter for the overlay (`l_text:times_80_bold:Beach%20Life`), and the `fl_layer_apply` parameter to specify its position (`fl_layer_apply,g_north,y_25`).|

##### Apply optimization transformations
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media :min=2 :sec=57 :player=cld} | You can apply transformations to optimize the delivery of assets. Let Cloudinary decide the best format using `f_auto`, and the best amount of compression to reduce the file size without impacting visual quality using `q_auto`.|

##### Delivery lifestyle
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media :min=3 :sec=18 :player=cld} | When you request a transformation, your original asset remains intact, and a new derived version of the asset is created. Each new transformation that you request counts towards your quota, but because derived assets are cached on a CDN, you won’t be charged again for requesting the same URL. Any slight change to the URL, though, is counted as a new transformation, even if the result is the same. 
|

### Delivery types
The **delivery type** element of the URL provides an indication about the way the asset will be delivered, although in most cases, the delivery type value is determined at the time that the asset is stored in Cloudinary. 

The following delivery type values are supported: 

|Delivery type | Description | Learn more
|---|---|--|
|**upload** | The default delivery type for uploaded assets. In most cases, this delivery type indicates that the asset is publicly available. However, there are options you can use to restrict access to assets with an `upload` delivery type. This includes [strict transformations](control_access_to_media#strict_transformations) and [access mode settings](control_access_to_media#authenticated_access_to_media_assets)) | [Upload API](image_upload_api_reference) |
|**private** | The URL for the original asset can be accessed only with a signed URL. Transformed versions of the asset are publicly available (unless [strict transformations](control_access_to_media#strict_transformations) are also defined).   | [Uploading private assets](upload_parameters#private_assets)|
|**authenticated** | Both original and transformed versions of the asset can be accessed only with a signed URL or an authentication token. | [Uploading authenticated assets](upload_parameters#authenticated_assets)  [Delivering authenticated assets](control_access_to_media#authenticated_access_to_media_assets) |
|**list** | Generates a list of assets that have a specified tag. **Note**: This isn't a delivery type in the classic sense, in that it doesn't relate to an individual asset. However, to use this feature, you specify `list`  in the **delivery type** element of the URL. | [Client-side asset lists](list_assets#client_side_asset_lists) |
|**fetch** | Enables transforming and delivering remote assets on the fly. | [Fetch remote media files](fetch_remote_images#fetch_and_deliver_remote_files)||**facebook**  **twitter**  **twitter\_name**  **gravatar**  |  Fetches a profile picture from Facebook, Twitter, or other specified social delivery type based on a specified ID or name. | [Social media profile pictures](social_media_profile_pictures#delivering_profile_pictures)|
|**youtube**  **hulu**  **vimeo**  **animoto**  **worldstarhiphop**  **dailymotion** |  Delivers a thumbnail image generated from the specified video from a public video site. | [Fetching thumbnails of public videos](fetch_remote_images#fetching_thumbnails_of_public_videos)|
|**multi** | Enables you to deliver a single animated image (GIF, PNG or WebP) from all image assets that have been assigned a specified tag.| [Multi method](image_upload_api_reference#multi_method)  [Create animated images](creating_animated_images)[Create PDF files](create_pdf_files_from_images)
|**text** | Enables you to generate an image in your product environment from a specified textual string along with style parameters for use as an image overlay. | [Text method](image_upload_api_reference#text_method)
|**url2png** | **Requires the URL2PNG Website Screenshots add-on**. Enables you to generate a screenshot of a website. | [URL2PNG Website Screenshots add-on](url2png_website_screenshots_addon)
|**asset**| **Relevant only for the Ruby on Rails SDK**. Delivers files that were uploaded using the `sync_static` command. | [Static files](rails_image_manipulation#static_files)|

> **TIP**:
>
> You can search for assets by delivery type using the Advanced Search in the Media Library. The most common types can be selected directly in the **Type** section of the [General](dam_advanced_search#general) search tab. All other types can be selected from the **More types** list.
### Parameter types
There are two types of transformation parameters:

* **Action parameters**: Parameters that perform a specific transformation on the asset.
* **Qualifier parameters**: Parameters that do not perform an action on their own, but rather alter the default behavior or otherwise adjust the outcome of the corresponding action parameter.It's best practice to include only one action parameter per URL component. 

If you want to apply multiple **actions** in a single transformation URL, apply them in separate [chained](#chained_transformations) components, where each action is performed on the result of the previous one.

> **NOTE**: In some of the Cloudinary SDKs, this action separation rule is enforced.

In contrast, **qualifier** parameters _must_ be included in the component with the action parameter they qualify. 

* Most qualifiers are optional, meaning the related action parameter can be used independently, but you can add optional qualifiers to modify the default behavior. 
* In some cases, an action parameter **requires** one or more qualifiers to fully define the transformation behavior.
* There are a few parameters that can be used independently as action parameters, but can also be used in other scenarios as a qualifier for another action. 

For example, the transformation below includes multiple transformation actions.  The qualifier transformations included together with a particular action define additional adjustments on the transformation action's behavior:

![Multiple transformation actions in a chained transformation](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_thumb,g_face,w_0.7/r_max/co_skyblue,e_outline/co_lightgray,e_shadow,x_5,y_8/docs/blue_sweater_model.png "thumb: w_300")

```nodejs
cloudinary.image("docs/blue_sweater_model.png", {transformation: [
  {aspect_ratio: "1.0", gravity: "face", width: "0.7", crop: "thumb"},
  {radius: "max"},
  {color: "skyblue", effect: "outline"},
  {color: "lightgray", effect: "shadow", x: 5, y: 8}
  ]})
```

```react
new CloudinaryImage("docs/blue_sweater_model.png")
  .resize(
    thumbnail()
      .width(0.7)
      .aspectRatio("1.0")
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .effect(outline().color("skyblue"))
  .effect(
    shadow()
      .color("lightgray")
      .offsetX(5)
      .offsetY(8)
  );
```

```vue
new CloudinaryImage("docs/blue_sweater_model.png")
  .resize(
    thumbnail()
      .width(0.7)
      .aspectRatio("1.0")
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .effect(outline().color("skyblue"))
  .effect(
    shadow()
      .color("lightgray")
      .offsetX(5)
      .offsetY(8)
  );
```

```angular
new CloudinaryImage("docs/blue_sweater_model.png")
  .resize(
    thumbnail()
      .width(0.7)
      .aspectRatio("1.0")
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .effect(outline().color("skyblue"))
  .effect(
    shadow()
      .color("lightgray")
      .offsetX(5)
      .offsetY(8)
  );
```

```js
new CloudinaryImage("docs/blue_sweater_model.png")
  .resize(
    thumbnail()
      .width(0.7)
      .aspectRatio("1.0")
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .effect(outline().color("skyblue"))
  .effect(
    shadow()
      .color("lightgray")
      .offsetX(5)
      .offsetY(8)
  );
```

```python
CloudinaryImage("docs/blue_sweater_model.png").image(transformation=[
  {'aspect_ratio': "1.0", 'gravity': "face", 'width': "0.7", 'crop': "thumb"},
  {'radius': "max"},
  {'color': "skyblue", 'effect': "outline"},
  {'color': "lightgray", 'effect': "shadow", 'x': 5, 'y': 8}
  ])
```

```php
(new ImageTag('docs/blue_sweater_model.png'))
	->resize(Resize::thumbnail()->width(0.7)
->aspectRatio(1.0)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	)
	->roundCorners(RoundCorners::max())
	->effect(Effect::outline()
	->color(Color::SKYBLUE)
	)
	->effect(Effect::shadow()
	->color(Color::LIGHTGRAY)
->offsetX(5)
->offsetY(8));
```

```java
cloudinary.url().transformation(new Transformation()
  .aspectRatio("1.0").gravity("face").width(0.7).crop("thumb").chain()
  .radius("max").chain()
  .color("skyblue").effect("outline").chain()
  .color("lightgray").effect("shadow").x(5).y(8)).imageTag("docs/blue_sweater_model.png");
```

```ruby
cl_image_tag("docs/blue_sweater_model.png", transformation: [
  {aspect_ratio: "1.0", gravity: "face", width: 0.7, crop: "thumb"},
  {radius: "max"},
  {color: "skyblue", effect: "outline"},
  {color: "lightgray", effect: "shadow", x: 5, y: 8}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .AspectRatio("1.0").Gravity("face").Width(0.7).Crop("thumb").Chain()
  .Radius("max").Chain()
  .Color("skyblue").Effect("outline").Chain()
  .Color("lightgray").Effect("shadow").X(5).Y(8)).BuildImageTag("docs/blue_sweater_model.png")
```

```dart
cloudinary.image('docs/blue_sweater_model.png').transformation(Transformation()
	.resize(Resize.thumbnail().width(0.7)
.aspectRatio('1.0')
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	)
	.roundCorners(RoundCorners.max())
	.effect(Effect.outline()
	.color(Color.SKYBLUE)
	)
	.effect(Effect.shadow()
	.color(Color.LIGHTGRAY)
.offsetX(5)
.offsetY(8)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setAspectRatio("1.0").setGravity("face").setWidth(0.7).setCrop("thumb").chain()
  .setRadius("max").chain()
  .setColor("skyblue").setEffect("outline").chain()
  .setColor("lightgray").setEffect("shadow").setX(5).setY(8)).generate("docs/blue_sweater_model.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .aspectRatio("1.0").gravity("face").width(0.7).crop("thumb").chain()
  .radius("max").chain()
  .color("skyblue").effect("outline").chain()
  .color("lightgray").effect("shadow").x(5).y(8)).generate("docs/blue_sweater_model.png");
```

```flutter
cloudinary.image('docs/blue_sweater_model.png').transformation(Transformation()
	.addTransformation("ar_1.0,c_thumb,g_face,w_0.7/r_max/co_skyblue,e_outline/co_lightgray,e_shadow,x_5,y_8"));
```

```kotlin
cloudinary.image {
	publicId("docs/blue_sweater_model.png")
	 resize(Resize.thumbnail() { width(0.7F)
 aspectRatio(1.0F)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 })
	 roundCorners(RoundCorners.max())
	 effect(Effect.outline() {
	 color(Color.SKYBLUE)
	 })
	 effect(Effect.shadow() {
	 color(Color.LIGHTGRAY)
 offsetX(5)
 offsetY(8) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/blue_sweater_model.png", {transformation: [
  {aspect_ratio: "1.0", gravity: "face", width: "0.7", crop: "thumb"},
  {radius: "max"},
  {color: "skyblue", effect: "outline"},
  {color: "lightgray", effect: "shadow", x: 5, y: 8}
  ]})
```

```react_native
new CloudinaryImage("docs/blue_sweater_model.png")
  .resize(
    thumbnail()
      .width(0.7)
      .aspectRatio("1.0")
      .gravity(focusOn(face()))
  )
  .roundCorners(max())
  .effect(outline().color("skyblue"))
  .effect(
    shadow()
      .color("lightgray")
      .offsetX(5)
      .offsetY(8)
  );
```

![ski video forward and reverse](https://res.cloudinary.com/demo/video/upload/ar_1.0,c_fill,h_300/du_4,e_boomerang/e_fade:-500/ski_jump.mp4 "thumb: w_300")

```nodejs
cloudinary.video("ski_jump", {transformation: [
  {aspect_ratio: "1.0", height: 300, crop: "fill"},
  {duration: "4", effect: "boomerang"},
  {effect: "fade:-500"}
  ]})
```

```react
new CloudinaryVideo("ski_jump.mp4")
  .resize(fill().height(300).aspectRatio("1.0"))
  .videoEdit(trim().duration("4.0"))
  .effect(boomerang())
  .effect(fadeOut().duration(500));
```

```vue
new CloudinaryVideo("ski_jump.mp4")
  .resize(fill().height(300).aspectRatio("1.0"))
  .videoEdit(trim().duration("4.0"))
  .effect(boomerang())
  .effect(fadeOut().duration(500));
```

```angular
new CloudinaryVideo("ski_jump.mp4")
  .resize(fill().height(300).aspectRatio("1.0"))
  .videoEdit(trim().duration("4.0"))
  .effect(boomerang())
  .effect(fadeOut().duration(500));
```

```js
new CloudinaryVideo("ski_jump.mp4")
  .resize(fill().height(300).aspectRatio("1.0"))
  .videoEdit(trim().duration("4.0"))
  .effect(boomerang())
  .effect(fadeOut().duration(500));
```

```python
CloudinaryVideo("ski_jump").video(transformation=[
  {'aspect_ratio': "1.0", 'height': 300, 'crop': "fill"},
  {'duration': "4", 'effect': "boomerang"},
  {'effect': "fade:-500"}
  ])
```

```php
(new VideoTag('ski_jump.mp4'))
	->resize(Resize::fill()->height(300)
->aspectRatio(1.0))
	->videoEdit(VideoEdit::trim()->duration(4.0))
	->effect(Effect::boomerang())
	->effect(Effect::fadeOut()->duration(500));
```

```java
cloudinary.url().transformation(new Transformation()
  .aspectRatio("1.0").height(300).crop("fill").chain()
  .duration("4").effect("boomerang").chain()
  .effect("fade:-500")).videoTag("ski_jump");
```

```ruby
cl_video_tag("ski_jump", transformation: [
  {aspect_ratio: "1.0", height: 300, crop: "fill"},
  {duration: "4", effect: "boomerang"},
  {effect: "fade:-500"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .AspectRatio("1.0").Height(300).Crop("fill").Chain()
  .Duration("4").Effect("boomerang").Chain()
  .Effect("fade:-500")).BuildVideoTag("ski_jump")
```

```dart
cloudinary.video('ski_jump.mp4').transformation(Transformation()
	.addTransformation("ar_1.0,c_fill,h_300/du_4,e_boomerang/e_fade:-500"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setAspectRatio("1.0").setHeight(300).setCrop("fill").chain()
  .setDuration("4").setEffect("boomerang").chain()
  .setEffect("fade:-500")).generate("ski_jump.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .aspectRatio("1.0").height(300).crop("fill").chain()
  .duration("4").effect("boomerang").chain()
  .effect("fade:-500")).resourceType("video").generate("ski_jump.mp4");
```

```flutter
cloudinary.video('ski_jump.mp4').transformation(Transformation()
	.addTransformation("ar_1.0,c_fill,h_300/du_4,e_boomerang/e_fade:-500"));
```

```kotlin
cloudinary.video {
	publicId("ski_jump.mp4")
	 resize(Resize.fill() { height(300)
 aspectRatio(1.0F) })
	 videoEdit(VideoEdit.trim() { duration(4.0F) })
	 effect(Effect.boomerang())
	 effect(Effect.fadeOut() { duration(500) }) 
}.generate()
```

```jquery
$.cloudinary.video("ski_jump", {transformation: [
  {aspect_ratio: "1.0", height: 300, crop: "fill"},
  {duration: "4", effect: "boomerang"},
  {effect: "fade:-500"}
  ]})
```

```react_native
new CloudinaryVideo("ski_jump.mp4")
  .resize(fill().height(300).aspectRatio("1.0"))
  .videoEdit(trim().duration("4.0"))
  .effect(boomerang())
  .effect(fadeOut().duration(500));
```

> **NOTE**: The URL tab above shows the URL as it looks when generated by an SDK. SDKs always generate the parameters within a specific URL component in alphabetical order (thus some qualifiers in the URL may come before the action that they qualify).

In this transformation:

* The [aspect ratio](transformation_reference#ar_aspect_ratio), [gravity](transformation_reference#g_gravity), and [width](transformation_reference#w_width) qualifiers control the way the [thumbnail crop](transformation_reference#c_thumb) action will be performed.
* The [rounding](transformation_reference#r_round_corners) action doesn't have any qualifiers. 
* The [color](transformation_reference#co_color) qualifier overrides the default color of the [outline effect](transformation_reference#e_effect) action.
* The [color](transformation_reference#co_color) qualifier overrides the default [shadow effect](transformation_reference#e_shadow) color, while the [x and y](transformation_reference#x_y_coordinates) qualifiers adjust its placement.
  

### Transformation flags
Transformation flags alter default transformation behavior. In some cases, they alter the default behavior of the transformation URL as a whole. In other cases, they alter the behavior of one or more specific transformation parameters that must be used together in the same URL component.

In general, tens of flags are available that can alter delivery and format, cropping and positioning, overlays,  metadata and color profiles, as well as PDF and text behaviors, just to name a few. 

For example: 

* [fl_attachment](transformation_reference#fl_attachment) alters the normal behavior of the overall transformation. Instead of delivering an asset in a web page, it causes the transformed media file to be downloaded as an attachment. This flag can be used independently of other transformations.

* [fl_relative](transformation_reference#fl_relative) modifies the way overlay resize parameters are evaluated.  This flag can only be used in conjunction with the overlay (`l_`) parameter.

* [fl_layer_apply](transformation_reference#fl_layer_apply) tells Cloudinary to apply all chained transformations, until a transformation component that includes this flag, on the last added overlay or underlay asset instead of applying them on the base asset. This flag acts as an indicator to close the layer section of the transformation, similar to a closing bracket. Placement definitions for how the layer should be applied, such as gravity and offsets are also defined in the component with this flag.

For details on all available transformation flags, see the [flag](transformation_reference#fl_flag) section of the Transformation Reference.

### Generating secure HTTPS URLs using SDKs

For backward compatibility reasons, some of Cloudinary's earlier SDK major versions generate `http` URLs by default. When using one of these SDKs, you'll generally want to instruct the SDK to generate `https` URLs by setting the `secure` parameter to `true` globally as part of your [SDK configuration](cloudinary_sdks#cross_sdk_info).  However, you can also pass the `secure` option locally in each transformation operation. 

The following example shows only the SDKs and library versions that require passing `secure` = `true` to generate HTTPS:

![HTTPS delivered image](https://res.cloudinary.com/demo/image/upload/phone_tree.jpg "thumb: w_500, secure: true, with_url:false, frameworks:python,php_1,java,js_1,jquery,react_1,angular_1,android")

```python
CloudinaryImage("phone_tree.jpg").image()
```

![HTTPS delivered video](https://res.cloudinary.com/demo/video/upload/docs/hotel_room.mp4 "thumb: w_500, secure: true, with_url:false, frameworks:python,php_1,java,js_1,jquery,react_1,angular_1,android")

```python
CloudinaryVideo("docs/hotel_room").video()
```

> **NOTES**:
>
> * For [SDK major versions first released in 2020 or later](cloudinary_sdks#post_2020_sdks), the `secure` parameter is `true` by default.

> * For more details on configuring the SDK of your choice, see the relevant [SDK guide](cloudinary_sdks)
> {/note}
> ### Verbose vs non-verbose syntax
> Some transformation parameters with multiple options offer two alternative syntaxes for defining the option values:

> * **Verbose, unordered**: Each option of the transformation (whether required or optional) is specified in the verbose format `name_value` and each option is separated by a colon (`:`) or semicolon (`;`) depending on the transformation. The options can be specified in any order, and you only need to include those that you want (or are required) to define.  With this syntax, you can also choose to specify only the options for which you don't want to use default values and default values will be applied for the others. 

> * **Non-verbose, ordered**: Transformation options are specified only by values, and must be entered in the pre-defined option order for that transformation. All values from the syntax to the left of the value you want to supply must also be entered.
> Transformations that support both verbose and non-verbose URL syntax are indicated as such in the [Transformation Reference](transformation_reference). When both are supported, SDKs always output the verbose syntax. 
> #### Verbose vs non-verbose example
> The [theme](transformation_reference#e_theme) effect supports the `color` and `photosensitivity` options, but you can specify them in a different order using verbose syntax. For example: 
> `e_theme:photosensitivity_110:color_black` 
> However, when using non-verbose syntax, you must specify the parameters in order. Therefore, even if you only want to change the default behavior of the `photosensitivity` (last) option, you must still specify the value to use for the `color` (first) option: 
> `e_theme:black:110` 
> ### Asset versions
> The **version** component is an optional part of Cloudinary delivery URLs that can be added to bypass the CDN cached version and force delivery of the newest asset. Cloudinary returns the value of the `version` parameter as part of every [upload response](upload_images#upload_response), and the returned `url` and `secure_url` parameters also include the `version` component, which represents the timestamp of the upload. 

> * Delivering the URL without a version value will deliver the cached version on the CDN if available or will request the latest version from Cloudinary if not cached (or when the cached version expires).

> * Delivering the URL with a version will deliver the cached CDN version only if the cached version matches the requested version number. Otherwise, it will bypass the cached CDN version and immediately request and deliver the latest version from Cloudinary.
> Example image delivery URL without version:
> ![URL without version](https://res.cloudinary.com/demo/image/upload/water-park-aerial-view.jpg "with_image:false, with_code:false")
> ![URL without version](https://res.cloudinary.com/demo/video/upload/race_finish_line.mp4 "with_image:false, with_code:false")
> Example image delivery URL with version:
> ![URL with version](https://res.cloudinary.com/demo/image/upload/v1699883548/water-park-aerial-view.jpg "with_image:false, with_code:false")
> ![URL without version](https://res.cloudinary.com/demo/video/upload/v1506944941/race_finish_line.mp4 "with_image:false, with_code:false")
> {tip}
> As an alternative to using versions to ensure that a new version of an asset is delivered, you can set the `invalidate` parameter to `true` while uploading a new version of an asset. This invalidates the previous version of the media asset throughout the CDN. Note that it usually takes between a few seconds and a few minutes for the invalidation to fully propagate through the CDN. Using a new `version` value in a URL takes effect immediately, but requires updating your delivery URLs in your production code. For details on invalidating media assets, see [Invalidating cached media assets on the CDN](invalidate_cached_media_assets_on_the_cdn). 
> {/tip}
> ## Chained Transformations
> Cloudinary supports powerful transformations that are applied on the fly using dynamic URLs. You can combine multiple transformation actions together as part of a single delivery request, e.g., crop an image and then add a border to it. 
> In general, it's best practice to **chain** each transformation [action](#parameter_types) in your URL as a separate component in the chain. 
> To support chained transformations, Cloudinary's transformation URLs allow you to include multiple transformation components, each separated by a slash (`/`), where each of the transformation components is executed on the result of the previous one. Cloudinary's SDKs can apply multiple transformation components by specifying the `transformation` parameter and setting it to an array of transformation maps. 
> Examples:
> 1. Three chained transformations: fill to a 250px square, then round to a circle, and deliver in the optimal transparent format:
> ![2 chained transformations applied to an image](https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,w_250/r_max/f_auto/livingroom-yellow-chair.png)
> ```nodejs
cloudinary.image("livingroom-yellow-chair.png", {transformation: [
  {aspect_ratio: "1.0", width: 250, crop: "fill"},
  {radius: "max"},
  {fetch_format: "auto"}
  ]})
```
> ```react
new CloudinaryImage("livingroom-yellow-chair.png")
  .resize(fill().width(250).aspectRatio("1.0"))
  .roundCorners(max())
  .delivery(format(auto()));
```
> ```vue
new CloudinaryImage("livingroom-yellow-chair.png")
  .resize(fill().width(250).aspectRatio("1.0"))
  .roundCorners(max())
  .delivery(format(auto()));
```
> ```angular
new CloudinaryImage("livingroom-yellow-chair.png")
  .resize(fill().width(250).aspectRatio("1.0"))
  .roundCorners(max())
  .delivery(format(auto()));
```
> ```js
new CloudinaryImage("livingroom-yellow-chair.png")
  .resize(fill().width(250).aspectRatio("1.0"))
  .roundCorners(max())
  .delivery(format(auto()));
```
> ```python
CloudinaryImage("livingroom-yellow-chair.png").image(transformation=[
  {'aspect_ratio': "1.0", 'width': 250, 'crop': "fill"},
  {'radius': "max"},
  {'fetch_format': "auto"}
  ])
```
> ```php
(new ImageTag('livingroom-yellow-chair.png'))
	->resize(Resize::fill()->width(250)
->aspectRatio(1.0))
	->roundCorners(RoundCorners::max())
	->delivery(Delivery::format(
	Format::auto()));
```
> ```java
cloudinary.url().transformation(new Transformation()
  .aspectRatio("1.0").width(250).crop("fill").chain()
  .radius("max").chain()
  .fetchFormat("auto")).imageTag("livingroom-yellow-chair.png");
```
> ```ruby
cl_image_tag("livingroom-yellow-chair.png", transformation: [
  {aspect_ratio: "1.0", width: 250, crop: "fill"},
  {radius: "max"},
  {fetch_format: "auto"}
  ])
```
> ```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .AspectRatio("1.0").Width(250).Crop("fill").Chain()
  .Radius("max").Chain()
  .FetchFormat("auto")).BuildImageTag("livingroom-yellow-chair.png")
```
> ```dart
cloudinary.image('livingroom-yellow-chair.png').transformation(Transformation()
	.resize(Resize.fill().width(250)
.aspectRatio('1.0'))
	.roundCorners(RoundCorners.max())
	.delivery(Delivery.format(
	Format.auto())));
```
> ```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setAspectRatio("1.0").setWidth(250).setCrop("fill").chain()
  .setRadius("max").chain()
  .setFetchFormat("auto")).generate("livingroom-yellow-chair.png")!, cloudinary: cloudinary)
```
> ```android
MediaManager.get().url().transformation(new Transformation()
  .aspectRatio("1.0").width(250).crop("fill").chain()
  .radius("max").chain()
  .fetchFormat("auto")).generate("livingroom-yellow-chair.png");
```
> ```flutter
cloudinary.image('livingroom-yellow-chair.png').transformation(Transformation()
	.addTransformation("ar_1.0,c_fill,w_250/r_max/f_auto"));
```
> ```kotlin
cloudinary.image {
	publicId("livingroom-yellow-chair.png")
	 resize(Resize.fill() { width(250)
 aspectRatio(1.0F) })
	 roundCorners(RoundCorners.max())
	 delivery(Delivery.format(
	Format.auto())) 
}.generate()
```
> ```jquery
$.cloudinary.image("livingroom-yellow-chair.png", {transformation: [
  {aspect_ratio: "1.0", width: 250, crop: "fill"},
  {radius: "max"},
  {fetch_format: "auto"}
  ]})
```
> ```react_native
new CloudinaryImage("livingroom-yellow-chair.png")
  .resize(fill().width(250).aspectRatio("1.0"))
  .roundCorners(max())
  .delivery(format(auto()));
```
> 1. Five chained transformations: Fill to a 250*400px portrait, then rotate the result by 20 degrees, then add a brown outline to the rotated image, and optimize the resulting image to deliver with the best compression that gives good visual quality and in the optimal transparent format:
> ![4 chained transformations applied to an image](https://res.cloudinary.com/demo/image/upload/c_fill,h_400,w_250/a_20/e_outline,co_brown/q_auto/f_auto/kitchen-island.png "thumb:h_350,dpr_2, height:350")
> ```nodejs
cloudinary.image("kitchen-island.png", {transformation: [
  {height: 400, width: 250, crop: "fill"},
  {angle: 20},
  {effect: "outline", color: "brown"},
  {quality: "auto"},
  {fetch_format: "auto"}
  ]})
```
> ```react
new CloudinaryImage("kitchen-island.png")
  .resize(fill().width(250).height(400))
  .rotate(byAngle(20))
  .effect(outline().color("brown"))
  .delivery(quality(auto()))
  .delivery(format(auto()));
```
> ```vue
new CloudinaryImage("kitchen-island.png")
  .resize(fill().width(250).height(400))
  .rotate(byAngle(20))
  .effect(outline().color("brown"))
  .delivery(quality(auto()))
  .delivery(format(auto()));
```
> ```angular
new CloudinaryImage("kitchen-island.png")
  .resize(fill().width(250).height(400))
  .rotate(byAngle(20))
  .effect(outline().color("brown"))
  .delivery(quality(auto()))
  .delivery(format(auto()));
```
> ```js
new CloudinaryImage("kitchen-island.png")
  .resize(fill().width(250).height(400))
  .rotate(byAngle(20))
  .effect(outline().color("brown"))
  .delivery(quality(auto()))
  .delivery(format(auto()));
```
> ```python
CloudinaryImage("kitchen-island.png").image(transformation=[
  {'height': 400, 'width': 250, 'crop': "fill"},
  {'angle': 20},
  {'effect': "outline", 'color': "brown"},
  {'quality': "auto"},
  {'fetch_format': "auto"}
  ])
```
> ```php
(new ImageTag('kitchen-island.png'))
	->resize(Resize::fill()->width(250)
->height(400))
	->rotate(Rotate::byAngle(20))
	->effect(Effect::outline()
	->color(Color::BROWN)
	)
	->delivery(Delivery::quality(
	Quality::auto()))
	->delivery(Delivery::format(
	Format::auto()));
```
> ```java
cloudinary.url().transformation(new Transformation()
  .height(400).width(250).crop("fill").chain()
  .angle(20).chain()
  .effect("outline").color("brown").chain()
  .quality("auto").chain()
  .fetchFormat("auto")).imageTag("kitchen-island.png");
```
> ```ruby
cl_image_tag("kitchen-island.png", transformation: [
  {height: 400, width: 250, crop: "fill"},
  {angle: 20},
  {effect: "outline", color: "brown"},
  {quality: "auto"},
  {fetch_format: "auto"}
  ])
```
> ```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(400).Width(250).Crop("fill").Chain()
  .Angle(20).Chain()
  .Effect("outline").Color("brown").Chain()
  .Quality("auto").Chain()
  .FetchFormat("auto")).BuildImageTag("kitchen-island.png")
```
> ```dart
cloudinary.image('kitchen-island.png').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(400))
	.rotate(Rotate.byAngle(20))
	.effect(Effect.outline()
	.color(Color.BROWN)
	)
	.delivery(Delivery.quality(
	Quality.auto()))
	.delivery(Delivery.format(
	Format.auto())));
```
> ```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setHeight(400).setWidth(250).setCrop("fill").chain()
  .setAngle(20).chain()
  .setEffect("outline").setColor("brown").chain()
  .setQuality("auto").chain()
  .setFetchFormat("auto")).generate("kitchen-island.png")!, cloudinary: cloudinary)
```
> ```android
MediaManager.get().url().transformation(new Transformation()
  .height(400).width(250).crop("fill").chain()
  .angle(20).chain()
  .effect("outline").color("brown").chain()
  .quality("auto").chain()
  .fetchFormat("auto")).generate("kitchen-island.png");
```
> ```flutter
cloudinary.image('kitchen-island.png').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(400))
	.rotate(Rotate.byAngle(20))
	.effect(Effect.outline()
	.color(Color.BROWN)
	)
	.delivery(Delivery.quality(
	Quality.auto()))
	.delivery(Delivery.format(
	Format.auto())));
```
> ```kotlin
cloudinary.image {
	publicId("kitchen-island.png")
	 resize(Resize.fill() { width(250)
 height(400) })
	 rotate(Rotate.byAngle(20))
	 effect(Effect.outline() {
	 color(Color.BROWN)
	 })
	 delivery(Delivery.quality(
	Quality.auto()))
	 delivery(Delivery.format(
	Format.auto())) 
}.generate()
```
> ```jquery
$.cloudinary.image("kitchen-island.png", {transformation: [
  {height: 400, width: 250, crop: "fill"},
  {angle: 20},
  {effect: "outline", color: "brown"},
  {quality: "auto"},
  {fetch_format: "auto"}
  ]})
```
> ```react_native
new CloudinaryImage("kitchen-island.png")
  .resize(fill().width(250).height(400))
  .rotate(byAngle(20))
  .effect(outline().color("brown"))
  .delivery(quality(auto()))
  .delivery(format(auto()));
```
> ## Named Transformations
> A **named transformation** is a pre-defined set of transformation parameters that has been given a custom name for easy reference. Instead of applying each of the required transformations separately to an asset, you can apply a single named transformation to apply all the transformations defined for it. This makes it easy to: 

> * Reuse transformations on multiple assets

> * Shorten complex transformation URLs

> * Hide the details of a transformation in your delivery URL. 

> * Simplify the enabling/disabling of transformations in [Strict Transformations](control_access_to_media#strict_transformations) mode. 
> Named transformations can include other named transformations, which allows you to define a chain of transformations to run on multiple assets more easily. 
> They're required for [baseline transformations](transformation_reference#bl_baseline), which save processing time and cost by avoiding regeneration of shared transformation steps.
> You can create and manage named transformations via the API or in the console UI using the [Transformation Builder](#transformation_builder).
> Once defined, you can apply a named transformation by setting the `transformation` parameter (or `t` in a URL) to the transformation's name. For example `t_instagram-auto-crop`. 
> You can include **user-defined variables** in your named transformations, and then pass the value for the user-defined variable into the transformation from an external source. This enables creating a named transformation 'template' with a lot of flexibility. 
> For example, you could define a complex named transformation that includes a text overlay as a named transformation, using a user-defined variable for the text string value. 
> Cloudinary automatically tracks which named transformations were used to generate each derived asset. You can view this information in the Derived Assets tab of the Manage page. For more information, see [Derived Assets](media_library_for_developers) in the Media Library for developers guide.
> You can also set named transformations as [transformation templates](dam_admin_asset_management#transformation_templates), which you can apply as templates in the Media Library so that you can preview how assets will look with different named transformations applied.
> For more details, see [user-defined variables](user_defined_variables). For a use-case example demonstrating named transformations with user-defined variables, see [Named transformation with a user-defined variable](user_defined_variables#named_transformation).
> {notes}

> * Keep in mind that not all transformations support all asset types and formats. Applying a named transformation to an asset of an unsupported type or format {valeExclude}will{/valeExclude} fail and return a 404 error. You can check whether you can use the parameters in your named transformation for both images and videos in the [transformation reference](transformation_reference).  You can also check the [supported formats for transformations](formats_supported_for_transformation).

> * Before you **update** the transformation parameters of an existing named transformation that's already used in production, make sure you're aware of all existing instances. To mitigate risk, when you update the parameters of an existing named transformation (via the Console UI or API), existing derived assets using the named transformation {valeExclude}are **not**{/valeExclude} automatically invalidated and regenerated.  If you're sure you want to apply the new definition to any already derived assets with that named transformation, you must specifically [invalidate](invalidate_cached_media_assets_on_the_cdn) those transformations or otherwise modify the other parameters in that delivery URL, so that the asset {valeExclude}will be{/valeExclude} re-derived using the new definition on next request.**Tip**: You can use the [regen_derived](cloudinary_cli#regen_derived) CLI command to invalidate and then regenerate derived assets after updating the definition for a named transformation.

> * Before you **delete** an existing named transformation, make sure you aren't using that transformation in production. When you **delete** an existing named transformation via the Console UI or API, and if there are fewer than 1000 existing derived assets using that named transformation, they're automatically invalidated (and {valeExclude}will{/valeExclude} return a `404` error on the next request).  If there are 1000 or more such derived assets, the delete request fails with a `403` error indicating that your named transformation has `too many derived resources` or `too many dependent transformations` (when the derived assets use the named transformation in combination with other parameters). 
> [//]: # (Nearly identical text, in admin_api and dam_admin_asset_management - if updating here, update there too)

### Creating named transformations
You can create a named transformation programmatically or using the Transformations UI in your Cloudinary console:

**To create a named transformation programmatically**, use the `Transformations` Admin API method. The following example defines a named transformation called `small_profile_thumbnail` that uses automatic cropping to resize assets to the required size for a particular application's thumbnail display: 

```multi

|ruby
Cloudinary::Api.create_transformation('small_profile_thumbnail',
  {width: 100, height: 150, crop: "fill", gravity: "auto"})

|php_2
$api->createTransformation("small_profile_thumbnail",
  ["width" => 100, "height" => 150, "crop" => "fill", "gravity" =>"auto"]);

|python
cloudinary.api.create_transformation("small_profile_thumbnail",
  dict(width = 100, height = 150, crop = "fill", gravity = "auto"))

|nodejs
cloudinary.v2.api
.create_transformation('small_profile_thumbnail',
  { width: 100, height: 150, crop: 'fill', gravity: 'auto' })
.then(result=>console.log(result));

|java
api.createTransformation("small_profile_thumbnail",
  new Transformation().width(150).height(100).crop("fill").gravity("auto").generate(),
  ObjectUtils.emptyMap());

|csharp
var createTransformParams = new CreateTransformParams(){
  Name = "small_profile_thumbnail",
  Transformation = new Transformation().Width(100).Height(150).Crop("fill").Gravity("auto")};
cloudinary.CreateTransform(createTransformParams);

|go
resp, err := cld.Admin.CreateTransformation(ctx, admin.CreateTransformationParams{
		Name:         "small_profile_thumbnail",
		Transformation: "c_fill,g_auto,h_150,w_100"})

|curl
curl \
  -d 'transformation=w_100,h_150,c_fill,g_auto' \
  -X POST \
  https://<API_KEY>:<API_SECRET>@api.cloudinary.com/v1_1/<CLOUD_NAME>/transformations/small_profile_thumbnail

|cli
cld admin create_transformation "small_profile_thumbnail" '{"width": 150, "height": 100, "crop": "fill", "gravity": "auto"}'
```

For more details and examples, see the [Create Transformation](admin_api#create_a_named_transformation) method in the _Admin API Reference_.

**To create a named transformation using the UI**: Expand the **Transform and Customize** section, accessible from the Console **Product Navigation** menu.  

From here, there are a few ways to create a named transformation:

* Start with a pre-defined transformation from the [Image Home](https://console.cloudinary.com/app/image/home) examples as a template and experiment with it in the UI. Click **Use it** to open the Transformation Builder and refine the transformation to your needs, and save it with your chosen name.
   
* View all your delivered dynamic transformations (those that were generated and delivered on the fly) in the [Log](https://console.cloudinary.com/app/image/manage/log) tab of the  **Manage Transformations** page and save one of those with your chosen name.
* Create a new transformation from scratch using the [Transformation Builder (Beta)](#transformation_builder) and save with your chosen name. Open the builder by clicking **New Transformation** from either of the Transform and Customize pages.

> **NOTE**:
>
> Names used for named transformations:

> * Must contain valid UTF8 characters only

> * Must not contain more than 1024 characters

> * Must not contain any of these characters: `\`, `/`, `?`, `&`, `#`, `%`, `.`, `,`, ``

Once you've saved your named transformations, you can view a list of them in the Console in the **[Image > Manage Transformations > Named Transformations](https://console.cloudinary.com/app/transformations/manage/named)** tab. From here, you can edit, copy, or enable/disable [Strict Transformations](control_access_to_media#strict_transformations).

You can also select to include a transformation as a [preset](dam_admin_asset_management#transformation_templates) so that users can apply it to assets using the [Download Options tab](dam_manage_individual_assets#drill_down_tabs) of the asset management drill-down page (available for **Assets Enterprise** plans).

### Transformation Builder
The Cloudinary Transformation Builder is the UI for creating and saving your transformations in a simple and easy to use way. The Transformation Builder has two modes of operation:

* [Construct](#construct_mode): Build transformations manually by selecting and configuring transformation actions.
* [Converse](#converse_mode): Build transformations using AI chat by describing the transformation with natural language.

> **INFO**: Converse mode is currently in Beta and may not yet be enabled for your account. Some implementation details may change before the official release. We invite you to request access and share any feedback via our [support team](https://support.cloudinary.com/hc/en-us/requests/new).

#### Transformation Builder video tutorial

Watch this video for a quick introduction to the Transformation Builder:

<div style="text-align:center; max-width: 800px; display: block; margin: 0 auto;">

  This video is brought to you by Cloudinary's video player - embed your own!Use the controls to set the playback speed, navigate to chapters of interest and select subtitles in your preferred language.

#### Tutorial contents This tutorial presents the following topics. Click a timestamp to jump to that part of the video.
#### Welcome to the Transformation Builder
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media2 :min=0 :sec=00 :player=cld} | Welcome to the Transformation Builder.  Here, you can play with your videos and images, either by making alterations one step at a time, or by telling our AI chat interface how you want them to look. Your original assets will remain intact, you’re just creating new variations. |

#### Edit, use and save a transformation 
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media2 :min=0 :sec=30 :player=cld} | Use the Quick Edit to tweak the result, known as a "transformation", and once you’re happy, try out the same transformation on different assets, copy the delivery URL or your preferred code snippet, or save the transformation as a "named transformation" for easier reuse in the future. |

#### Create a transformation using the Builder

To create a new transformation, [open the Builder](https://console.cloudinary.com/app/image/transformation_builder) and select the mode to use.

![Construct and Converse selector](https://cloudinary-res.cloudinary.com/image/upload/f_auto/q_auto/docs/converse-construct.png "popup: true, thumb: w_250,dpr_2, width:250, conditional: false")

#### Construct mode

The Transformation Builder in **construct** mode provides:

* A simple and intuitive UI for selecting and configuring transformation actions - easily discover actions and parameters as you build.
* Transformations built as a series of self-contained actions so you can see the results of each one as you apply it.
* URL and SDK code ready to copy and paste directly to your code.
* The ability to update the default preview image to something from your own product environment.
* Quick edit functionality, to easily add transformations using [URL syntax](#transformation_reference).

![Transformation Builder in construct mode](https://cloudinary-res.cloudinary.com/image/upload/f_auto/q_auto/v1688632062/docs/construct-mode.png "popup: true, thumb: w_600,dpr_2, width:600, conditional: false")

The builder supports most common transformation actions. If the transformation action you are trying to apply is not listed, you can add an **Additional Transformation** action and use [transformation URL syntax](#transformation_reference) to specify your transformation. Alternatively, you can switch to the legacy editor to create your transformation.

#### Converse mode

The Transformation Builder in **converse** mode provides:

* An AI-powered conversational interface to describe the transformation you want to create with natural language. 
* Iterative prompts to continue the conversation and perfect the transformation.
* URL and SDK code ready to copy and paste directly to your code.
* The ability to update the default preview image to something from your own product environment.

![Transformation Builder in converse mode](https://cloudinary-res.cloudinary.com/image/upload/f_auto/q_auto/v1688632079/docs/converse-mode.png "popup: true, thumb: w_600,dpr_2, width:600, conditional: false")

> **NOTE**:
>
> :title=Notes and limitations:

> * The conversational interface is powered by GPT.

> * It answers questions related to Cloudinary transformations only.

> * The use of AI, including the GPT model, means that answers may not be 100% accurate.

> * We have implemented mechanisms to improve the accuracy of results for transaction-related queries compared to using ChatGPT directly.

> * We are continually learning and making improvements as this technology progresses.

### Named transformation examples

Below are two quite different named transformations applied to the same `lighthouse_reflection` image:

* **fill_square_400** is defined as `ar_1:1,c_fill,g_auto,w_400`, which fills (scales and crops) the image into a 400*400 square, automatically focussing on the most interesting area of the image:
  ![apply a 'fill_square_400' named transformation to an image](https://res.cloudinary.com/demo/image/upload/t_fill_square_400/lighthouse_reflection.jpg "thumb:w_250,dpr_2, width:250")

```nodejs
cloudinary.image("lighthouse_reflection.jpg", {transformation: ["fill_square_400"]})
```

```react
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("fill_square_400")
);
```

```vue
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("fill_square_400")
);
```

```angular
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("fill_square_400")
);
```

```js
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("fill_square_400")
);
```

```python
CloudinaryImage("lighthouse_reflection.jpg").image(transformation=["fill_square_400"])
```

```php
(new ImageTag('lighthouse_reflection.jpg'))
	->namedTransformation(NamedTransformation::name("fill_square_400"));
```

```java
cloudinary.url().transformation(new Transformation().named("fill_square_400")).imageTag("lighthouse_reflection.jpg");
```

```ruby
cl_image_tag("lighthouse_reflection.jpg", transformation: ["fill_square_400"])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Named("fill_square_400")).BuildImageTag("lighthouse_reflection.jpg")
```

```dart
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("fill_square_400")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setNamed("fill_square_400")).generate("lighthouse_reflection.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().named("fill_square_400")).generate("lighthouse_reflection.jpg");
```

```flutter
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("fill_square_400")));
```

```kotlin
cloudinary.image {
	publicId("lighthouse_reflection.jpg")
	 namedTransformation(NamedTransformation.name("fill_square_400")) 
}.generate()
```

```jquery
$.cloudinary.image("lighthouse_reflection.jpg", {transformation: ["fill_square_400"]})
```

```react_native
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("fill_square_400")
);
``` &nbsp;
* **rounded_cartoonified_frame** is defined as `e_cartoonify/r_max/co_rgb:add8e6,e_outline:30/b_rgb:add8e6`, which applies a cartoonify effect, rounds it to a circle or oval shape, adds a light blue outline around the oval so that the image won't be touching the edges of the frame, and then fills the transparent background with the same color as the outline:
![apply a 'rounded_cartoonified_frame' named transformation to an image](https://res.cloudinary.com/demo/image/upload/t_oval_cartoonified_frame/lighthouse_reflection.jpg "thumb:w_300")

```nodejs
cloudinary.image("lighthouse_reflection.jpg", {transformation: ["oval_cartoonified_frame"]})
```

```react
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("oval_cartoonified_frame")
);
```

```vue
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("oval_cartoonified_frame")
);
```

```angular
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("oval_cartoonified_frame")
);
```

```js
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("oval_cartoonified_frame")
);
```

```python
CloudinaryImage("lighthouse_reflection.jpg").image(transformation=["oval_cartoonified_frame"])
```

```php
(new ImageTag('lighthouse_reflection.jpg'))
	->namedTransformation(NamedTransformation::name("oval_cartoonified_frame"));
```

```java
cloudinary.url().transformation(new Transformation().named("oval_cartoonified_frame")).imageTag("lighthouse_reflection.jpg");
```

```ruby
cl_image_tag("lighthouse_reflection.jpg", transformation: ["oval_cartoonified_frame"])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Named("oval_cartoonified_frame")).BuildImageTag("lighthouse_reflection.jpg")
```

```dart
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("oval_cartoonified_frame")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setNamed("oval_cartoonified_frame")).generate("lighthouse_reflection.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().named("oval_cartoonified_frame")).generate("lighthouse_reflection.jpg");
```

```flutter
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("oval_cartoonified_frame")));
```

```kotlin
cloudinary.image {
	publicId("lighthouse_reflection.jpg")
	 namedTransformation(NamedTransformation.name("oval_cartoonified_frame")) 
}.generate()
```

```jquery
$.cloudinary.image("lighthouse_reflection.jpg", {transformation: ["oval_cartoonified_frame"]})
```

```react_native
new CloudinaryImage("lighthouse_reflection.jpg").namedTransformation(
  name("oval_cartoonified_frame")
);
```

### Chaining named transformations

You can chain named transformations before or after other transformations. For example, here the `oval_cartoonified_frame` named transformation is applied after a grayscale effect:

![apply both a named and direct transformation to the image](https://res.cloudinary.com/demo/image/upload/e_grayscale/t_oval_cartoonified_frame/lighthouse_reflection.jpg "thumb:w_300")

```nodejs
cloudinary.image("lighthouse_reflection.jpg", {transformation: [
  {effect: "grayscale"},
  {transformation: ["oval_cartoonified_frame"]}
  ]})
```

```react
new CloudinaryImage("lighthouse_reflection.jpg")
  .effect(grayscale())
  .namedTransformation(name("oval_cartoonified_frame"));
```

```vue
new CloudinaryImage("lighthouse_reflection.jpg")
  .effect(grayscale())
  .namedTransformation(name("oval_cartoonified_frame"));
```

```angular
new CloudinaryImage("lighthouse_reflection.jpg")
  .effect(grayscale())
  .namedTransformation(name("oval_cartoonified_frame"));
```

```js
new CloudinaryImage("lighthouse_reflection.jpg")
  .effect(grayscale())
  .namedTransformation(name("oval_cartoonified_frame"));
```

```python
CloudinaryImage("lighthouse_reflection.jpg").image(transformation=[
  {'effect': "grayscale"},
  {'transformation': ["oval_cartoonified_frame"]}
  ])
```

```php
(new ImageTag('lighthouse_reflection.jpg'))
	->effect(Effect::grayscale())
	->namedTransformation(NamedTransformation::name("oval_cartoonified_frame"));
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("grayscale").chain()
  .named("oval_cartoonified_frame")).imageTag("lighthouse_reflection.jpg");
```

```ruby
cl_image_tag("lighthouse_reflection.jpg", transformation: [
  {effect: "grayscale"},
  {transformation: ["oval_cartoonified_frame"]}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("grayscale").Chain()
  .Named("oval_cartoonified_frame")).BuildImageTag("lighthouse_reflection.jpg")
```

```dart
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.effect(Effect.grayscale())
	.namedTransformation(NamedTransformation.name("oval_cartoonified_frame")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("grayscale").chain()
  .setNamed("oval_cartoonified_frame")).generate("lighthouse_reflection.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("grayscale").chain()
  .named("oval_cartoonified_frame")).generate("lighthouse_reflection.jpg");
```

```flutter
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.effect(Effect.grayscale())
	.namedTransformation(NamedTransformation.name("oval_cartoonified_frame")));
```

```kotlin
cloudinary.image {
	publicId("lighthouse_reflection.jpg")
	 effect(Effect.grayscale())
	 namedTransformation(NamedTransformation.name("oval_cartoonified_frame")) 
}.generate()
```

```jquery
$.cloudinary.image("lighthouse_reflection.jpg", {transformation: [
  {effect: "grayscale"},
  {transformation: ["oval_cartoonified_frame"]}
  ]})
```

```react_native
new CloudinaryImage("lighthouse_reflection.jpg")
  .effect(grayscale())
  .namedTransformation(name("oval_cartoonified_frame"));
```

You can also chain multiple named transformations. For example, to chain the named transformations defined in the previous section{variable:videoDuNote}:

![Applying multiple named transformations](https://res.cloudinary.com/demo/image/upload/t_fill_square_400/t_rounded_cartoonified_frame/lighthouse_reflection.jpg "thumb:w_250")

```nodejs
cloudinary.image("lighthouse_reflection.jpg", {transformation: [
  {transformation: ["fill_square_400"]},
  {transformation: ["rounded_cartoonified_frame"]}
  ]})
```

```react
new CloudinaryImage("lighthouse_reflection.jpg")
  .namedTransformation(name("fill_square_400"))
  .namedTransformation(name("rounded_cartoonified_frame"));
```

```vue
new CloudinaryImage("lighthouse_reflection.jpg")
  .namedTransformation(name("fill_square_400"))
  .namedTransformation(name("rounded_cartoonified_frame"));
```

```angular
new CloudinaryImage("lighthouse_reflection.jpg")
  .namedTransformation(name("fill_square_400"))
  .namedTransformation(name("rounded_cartoonified_frame"));
```

```js
new CloudinaryImage("lighthouse_reflection.jpg")
  .namedTransformation(name("fill_square_400"))
  .namedTransformation(name("rounded_cartoonified_frame"));
```

```python
CloudinaryImage("lighthouse_reflection.jpg").image(transformation=[
  {'transformation': ["fill_square_400"]},
  {'transformation': ["rounded_cartoonified_frame"]}
  ])
```

```php
(new ImageTag('lighthouse_reflection.jpg'))
	->namedTransformation(NamedTransformation::name("fill_square_400"))
	->namedTransformation(NamedTransformation::name("rounded_cartoonified_frame"));
```

```java
cloudinary.url().transformation(new Transformation()
  .named("fill_square_400").chain()
  .named("rounded_cartoonified_frame")).imageTag("lighthouse_reflection.jpg");
```

```ruby
cl_image_tag("lighthouse_reflection.jpg", transformation: [
  {transformation: ["fill_square_400"]},
  {transformation: ["rounded_cartoonified_frame"]}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Named("fill_square_400").Chain()
  .Named("rounded_cartoonified_frame")).BuildImageTag("lighthouse_reflection.jpg")
```

```dart
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("fill_square_400"))
	.namedTransformation(NamedTransformation.name("rounded_cartoonified_frame")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setNamed("fill_square_400").chain()
  .setNamed("rounded_cartoonified_frame")).generate("lighthouse_reflection.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .named("fill_square_400").chain()
  .named("rounded_cartoonified_frame")).generate("lighthouse_reflection.jpg");
```

```flutter
cloudinary.image('lighthouse_reflection.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("fill_square_400"))
	.namedTransformation(NamedTransformation.name("rounded_cartoonified_frame")));
```

```kotlin
cloudinary.image {
	publicId("lighthouse_reflection.jpg")
	 namedTransformation(NamedTransformation.name("fill_square_400"))
	 namedTransformation(NamedTransformation.name("rounded_cartoonified_frame")) 
}.generate()
```

```jquery
$.cloudinary.image("lighthouse_reflection.jpg", {transformation: [
  {transformation: ["fill_square_400"]},
  {transformation: ["rounded_cartoonified_frame"]}
  ]})
```

```react_native
new CloudinaryImage("lighthouse_reflection.jpg")
  .namedTransformation(name("fill_square_400"))
  .namedTransformation(name("rounded_cartoonified_frame"));
```

![Applying all 3 named transformations](https://res.cloudinary.com/demo/video/upload/t_round-if-portrait/t_portrait-resize-g_auto/t_logo-overlay/du_10/docs/green_screen_queen.mp4)

```nodejs
cloudinary.video("docs/green_screen_queen", {transformation: [
  {transformation: ["round-if-portrait"]},
  {transformation: ["portrait-resize-g_auto"]},
  {transformation: ["logo-overlay"]},
  {duration: "10"}
  ]})
```

```react
new CloudinaryVideo("docs/green_screen_queen.mp4")
  .namedTransformation(name("round-if-portrait"))
  .namedTransformation(name("portrait-resize-g_auto"))
  .namedTransformation(name("logo-overlay"))
  .videoEdit(trim().duration("10.0"));
```

```vue
new CloudinaryVideo("docs/green_screen_queen.mp4")
  .namedTransformation(name("round-if-portrait"))
  .namedTransformation(name("portrait-resize-g_auto"))
  .namedTransformation(name("logo-overlay"))
  .videoEdit(trim().duration("10.0"));
```

```angular
new CloudinaryVideo("docs/green_screen_queen.mp4")
  .namedTransformation(name("round-if-portrait"))
  .namedTransformation(name("portrait-resize-g_auto"))
  .namedTransformation(name("logo-overlay"))
  .videoEdit(trim().duration("10.0"));
```

```js
new CloudinaryVideo("docs/green_screen_queen.mp4")
  .namedTransformation(name("round-if-portrait"))
  .namedTransformation(name("portrait-resize-g_auto"))
  .namedTransformation(name("logo-overlay"))
  .videoEdit(trim().duration("10.0"));
```

```python
CloudinaryVideo("docs/green_screen_queen").video(transformation=[
  {'transformation': ["round-if-portrait"]},
  {'transformation': ["portrait-resize-g_auto"]},
  {'transformation': ["logo-overlay"]},
  {'duration': "10"}
  ])
```

```php
(new VideoTag('docs/green_screen_queen.mp4'))
	->namedTransformation(NamedTransformation::name("round-if-portrait"))
	->namedTransformation(NamedTransformation::name("portrait-resize-g_auto"))
	->namedTransformation(NamedTransformation::name("logo-overlay"))
	->videoEdit(VideoEdit::trim()->duration(10.0));
```

```java
cloudinary.url().transformation(new Transformation()
  .named("round-if-portrait").chain()
  .named("portrait-resize-g_auto").chain()
  .named("logo-overlay").chain()
  .duration("10")).videoTag("docs/green_screen_queen");
```

```ruby
cl_video_tag("docs/green_screen_queen", transformation: [
  {transformation: ["round-if-portrait"]},
  {transformation: ["portrait-resize-g_auto"]},
  {transformation: ["logo-overlay"]},
  {duration: "10"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Named("round-if-portrait").Chain()
  .Named("portrait-resize-g_auto").Chain()
  .Named("logo-overlay").Chain()
  .Duration("10")).BuildVideoTag("docs/green_screen_queen")
```

```dart
cloudinary.video('docs/green_screen_queen.mp4').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("round-if-portrait"))
	.namedTransformation(NamedTransformation.name("portrait-resize-g_auto"))
	.namedTransformation(NamedTransformation.name("logo-overlay"))
	.videoEdit(VideoEdit.trim().duration('10.0')));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setNamed("round-if-portrait").chain()
  .setNamed("portrait-resize-g_auto").chain()
  .setNamed("logo-overlay").chain()
  .setDuration("10")).generate("docs/green_screen_queen.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .named("round-if-portrait").chain()
  .named("portrait-resize-g_auto").chain()
  .named("logo-overlay").chain()
  .duration("10")).resourceType("video").generate("docs/green_screen_queen.mp4");
```

```flutter
cloudinary.video('docs/green_screen_queen.mp4').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("round-if-portrait"))
	.namedTransformation(NamedTransformation.name("portrait-resize-g_auto"))
	.namedTransformation(NamedTransformation.name("logo-overlay"))
	.videoEdit(VideoEdit.trim().duration('10.0')));
```

```kotlin
cloudinary.video {
	publicId("docs/green_screen_queen.mp4")
	 namedTransformation(NamedTransformation.name("round-if-portrait"))
	 namedTransformation(NamedTransformation.name("portrait-resize-g_auto"))
	 namedTransformation(NamedTransformation.name("logo-overlay"))
	 videoEdit(VideoEdit.trim() { duration(10.0F) }) 
}.generate()
```

```jquery
$.cloudinary.video("docs/green_screen_queen", {transformation: [
  {transformation: ["round-if-portrait"]},
  {transformation: ["portrait-resize-g_auto"]},
  {transformation: ["logo-overlay"]},
  {duration: "10"}
  ]})
```

```react_native
new CloudinaryVideo("docs/green_screen_queen.mp4")
  .namedTransformation(name("round-if-portrait"))
  .namedTransformation(name("portrait-resize-g_auto"))
  .namedTransformation(name("logo-overlay"))
  .videoEdit(trim().duration("10.0"));
```

Chaining transformations can create long URLs, so instead you could define a named transformation that includes a chain of other transformations, including other named transformations. For example, we can create a named transformation that is a composite of the named transformations from the section above. 

It is now simple to specify a single named transformation and apply it to any asset:

![demo_combined named transformation applied to image](https://res.cloudinary.com/demo/image/upload/t_fill_circle_cartoon/sunset_lake.jpg "thumb:w_250")

```nodejs
cloudinary.image("sunset_lake.jpg", {transformation: ["fill_circle_cartoon"]})
```

```react
new CloudinaryImage("sunset_lake.jpg").namedTransformation(
  name("fill_circle_cartoon")
);
```

```vue
new CloudinaryImage("sunset_lake.jpg").namedTransformation(
  name("fill_circle_cartoon")
);
```

```angular
new CloudinaryImage("sunset_lake.jpg").namedTransformation(
  name("fill_circle_cartoon")
);
```

```js
new CloudinaryImage("sunset_lake.jpg").namedTransformation(
  name("fill_circle_cartoon")
);
```

```python
CloudinaryImage("sunset_lake.jpg").image(transformation=["fill_circle_cartoon"])
```

```php
(new ImageTag('sunset_lake.jpg'))
	->namedTransformation(NamedTransformation::name("fill_circle_cartoon"));
```

```java
cloudinary.url().transformation(new Transformation().named("fill_circle_cartoon")).imageTag("sunset_lake.jpg");
```

```ruby
cl_image_tag("sunset_lake.jpg", transformation: ["fill_circle_cartoon"])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Named("fill_circle_cartoon")).BuildImageTag("sunset_lake.jpg")
```

```dart
cloudinary.image('sunset_lake.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("fill_circle_cartoon")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setNamed("fill_circle_cartoon")).generate("sunset_lake.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().named("fill_circle_cartoon")).generate("sunset_lake.jpg");
```

```flutter
cloudinary.image('sunset_lake.jpg').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("fill_circle_cartoon")));
```

```kotlin
cloudinary.image {
	publicId("sunset_lake.jpg")
	 namedTransformation(NamedTransformation.name("fill_circle_cartoon")) 
}.generate()
```

```jquery
$.cloudinary.image("sunset_lake.jpg", {transformation: ["fill_circle_cartoon"]})
```

```react_native
new CloudinaryImage("sunset_lake.jpg").namedTransformation(
  name("fill_circle_cartoon")
);
```

![demo combined named transformation applied to video with variables](https://res.cloudinary.com/demo/video/upload/t_demo-combine-named/du_10/docs/long-boarding-one-surfer.mp4)

```nodejs
cloudinary.video("docs/long-boarding-one-surfer", {transformation: [
  {transformation: ["demo-combine-named"]},
  {duration: "10"}
  ]})
```

```react
new CloudinaryVideo("docs/long-boarding-one-surfer.mp4")
  .namedTransformation(name("demo-combine-named"))
  .videoEdit(trim().duration("10.0"));
```

```vue
new CloudinaryVideo("docs/long-boarding-one-surfer.mp4")
  .namedTransformation(name("demo-combine-named"))
  .videoEdit(trim().duration("10.0"));
```

```angular
new CloudinaryVideo("docs/long-boarding-one-surfer.mp4")
  .namedTransformation(name("demo-combine-named"))
  .videoEdit(trim().duration("10.0"));
```

```js
new CloudinaryVideo("docs/long-boarding-one-surfer.mp4")
  .namedTransformation(name("demo-combine-named"))
  .videoEdit(trim().duration("10.0"));
```

```python
CloudinaryVideo("docs/long-boarding-one-surfer").video(transformation=[
  {'transformation': ["demo-combine-named"]},
  {'duration': "10"}
  ])
```

```php
(new VideoTag('docs/long-boarding-one-surfer.mp4'))
	->namedTransformation(NamedTransformation::name("demo-combine-named"))
	->videoEdit(VideoEdit::trim()->duration(10.0));
```

```java
cloudinary.url().transformation(new Transformation()
  .named("demo-combine-named").chain()
  .duration("10")).videoTag("docs/long-boarding-one-surfer");
```

```ruby
cl_video_tag("docs/long-boarding-one-surfer", transformation: [
  {transformation: ["demo-combine-named"]},
  {duration: "10"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Named("demo-combine-named").Chain()
  .Duration("10")).BuildVideoTag("docs/long-boarding-one-surfer")
```

```dart
cloudinary.video('docs/long-boarding-one-surfer.mp4').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("demo-combine-named"))
	.videoEdit(VideoEdit.trim().duration('10.0')));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setNamed("demo-combine-named").chain()
  .setDuration("10")).generate("docs/long-boarding-one-surfer.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .named("demo-combine-named").chain()
  .duration("10")).resourceType("video").generate("docs/long-boarding-one-surfer.mp4");
```

```flutter
cloudinary.video('docs/long-boarding-one-surfer.mp4').transformation(Transformation()
	.namedTransformation(NamedTransformation.name("demo-combine-named"))
	.videoEdit(VideoEdit.trim().duration('10.0')));
```

```kotlin
cloudinary.video {
	publicId("docs/long-boarding-one-surfer.mp4")
	 namedTransformation(NamedTransformation.name("demo-combine-named"))
	 videoEdit(VideoEdit.trim() { duration(10.0F) }) 
}.generate()
```

```jquery
$.cloudinary.video("docs/long-boarding-one-surfer", {transformation: [
  {transformation: ["demo-combine-named"]},
  {duration: "10"}
  ]})
```

```react_native
new CloudinaryVideo("docs/long-boarding-one-surfer.mp4")
  .namedTransformation(name("demo-combine-named"))
  .videoEdit(trim().duration("10.0"));
```

Where the `fill_circle_cartoon` named transformation is defined as: `t_fill_square_400/t_rounded_cartoonified_frame`. 
### Limitations of named transformations

#### Automatic format

The [automatic format](transformation_reference#f_auto) transformation parameter (`f_auto`) is not effective if used in named transformations. 

When `f_auto` is used in a delivery URL, the CDN layer determines the best format to deliver.  If this parameter is hidden in a named transformation then it is not visible to the CDN. 

You can use `f_auto` together with a named transformation by chaining the components, for example, `t_square/f_auto`.

#### Automatic quality

The [automatic quality](transformation_reference#q_auto) transformation parameter (`q_auto`) is effective in named transformations, except in one situation.

When `q_auto` is used in a delivery URL and the browser sets the `Save-Data` HTTP header to `on` in the request, `q_auto` is translated to `q_auto:eco` at the CDN level. If this parameter is hidden in a named transformation then it is not visible to the CDN, so the default level is applied, `q_auto:good`. 

To accommodate this situation, you may prefer to use `q_auto` together with a named transformation by chaining the components, for example, `t_square/q_auto`.

> **NOTE**: If you explicitly set the type of quality to apply in a named transformation, for example, `q_auto:best`, then there are no concerns as there are no dependencies on the CDN level.

**Learn more**: [Save-Data support](image_optimization#save_data_support)

#### Automatic width

The [automatic width](transformation_reference#w_auto) transformation parameter (`w_auto`) is not effective if used in named transformations. 

For responsive image solutions, `w_auto` must appear directly in the delivery URL. If it's hidden within a named transformation, it won't be visible to the client or CDN (depending on the solution) and therefore won't take effect.

See [Responsive images using the cloudinary-core JS library](responsive_client_side_js) and [Responsive images using client hints](responsive_server_side_client_hints#automatic_image_width).

#### Automatic device pixel ratio

The [automatic device pixel ratio](transformation_reference#dpr_auto) transformation parameter (`dpr_auto`) is not effective if used in named transformations. 

For responsive image solutions, `dpr_auto` must appear directly in the delivery URL. If it's hidden within a named transformation, it won't be visible to the client or CDN (depending on the solution) and therefore won't take effect.

See [Responsive images using the cloudinary-core JS library](responsive_client_side_js) and [Responsive images using client hints](responsive_server_side_client_hints#automatic_pixel_density_detection).

### Named transformation video tutorial

Watch this video tutorial to learn how to create re-usable named transformations with the [Cloudinary Transformation Builder](https://console.cloudinary.com/app/image/transformation_builder) UI.

#### Tutorial contents This tutorial presents the following topics. Click a timestamp to jump to that part of the video.

#### Using the same transformations over and over?
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media1 :min=0 :sec=05 :player=yt} | If you find yourself using the same transformations repeatedly, you can use named transformations to create a succinct identifier that tells Cloudinary exactly what to do with the asset. 
|

#### Open the Transformation Builder
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media1 :min=0 :sec=24 :player=yt} | To get started, expand the **Transformations** option in the menu of the Cloudinary Console. From here, select **Named Transformations** and click **Add New** to launch the Transformation Builder.

#### Start adding your transformations 
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media1 :min=0 :sec=37 :player=yt} | Click the **Start Creating** button to initiate your new transformation. You can see the available actions, such as the thumbnail action. In this example, it's set to a width and height of 500px, automatic focus and zoom level of 0.5. Click **Apply and Close** to view the result of that transformation on the preview image.
|

#### Save your named transformation
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media1 :min=1 :sec=06 :player=yt} | You can continue adding actions to your transformation but if you're happy, click **Save as Named Transformation** and give your new transformation a name, such as "my-transformation". Click **Save Transformation** to save it, and you'll see the name appear in the top corner.
|

#### Use your named transformation
{table:class=tutorial-bullets}|  | 
| --- | --- |
|{videotime:id=media1 :min=1 :sec=23 :player=yt} | You can use your new transformation in place of your long transformation string. Remove the existing string from your URL and replace it with `t_my-transformation`. You should have the same result as chaining all the transformations previously. You can use this now to replicate that same transformation on any asset. 
|

## Embedding images in web pages using SDKs
You access uploaded images or their derived transformations with URLs. These URLs can be used as the <code>\ of the <code>\ tags in your HTML code or other frontend functions to deliver your media assets. 

But the easiest way to deliver them is using Cloudinary's framework SDKs to automatically generate transformation URLs and embed them using HTML image tags. The SDKs offer two main helper methods: the **URL helper** and the **image tag helper**.

### Cloudinary URL helper method
The **Cloudinary URL helper method** (e.g., `cloudinary_url` in the Ruby/Rails SDK) automatically generates the image source URL itself. For example, using the URL helper method to return the URL of the <code>leather_bag_gray image, padded to a scaled width and height of 300 pixels with a blue background for the padding:

![cloudinary_url example](https://res.cloudinary.com/demo/image/upload/b_blue,c_pad,h_300,w_300/sample.jpg "with_image: false, url_code: true, with_url: false")

```nodejs
cloudinary.image("sample.jpg", {background: "blue", height: 300, width: 300, crop: "pad"})
```

```react
new CloudinaryImage("sample.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```vue
new CloudinaryImage("sample.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```angular
new CloudinaryImage("sample.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```js
new CloudinaryImage("sample.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```python
CloudinaryImage("sample.jpg").image(background="blue", height=300, width=300, crop="pad")
```

```php
(new ImageTag('sample.jpg'))
	->resize(Resize::pad()->width(300)
->height(300)
	->background(
	Background::color(Color::BLUE))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("blue").height(300).width(300).crop("pad")).imageTag("sample.jpg");
```

```ruby
cl_image_tag("sample.jpg", background: "blue", height: 300, width: 300, crop: "pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("blue").Height(300).Width(300).Crop("pad")).BuildImageTag("sample.jpg")
```

```dart
cloudinary.image('sample.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.color(Color.BLUE))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("blue").setHeight(300).setWidth(300).setCrop("pad")).generate("sample.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("blue").height(300).width(300).crop("pad")).generate("sample.jpg");
```

```flutter
cloudinary.image('sample.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.color(Color.BLUE))
	));
```

```kotlin
cloudinary.image {
	publicId("sample.jpg")
	 resize(Resize.pad() { width(300)
 height(300)
	 background(
	Background.color(Color.BLUE))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("sample.jpg", {background: "blue", height: 300, width: 300, crop: "pad"})
```

```react_native
new CloudinaryImage("sample.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

This SDK code outputs the URL:
![cloudinary_url example](https://res.cloudinary.com/demo/image/upload/b_blue,c_pad,h_300,w_300/sample.jpg "with_image: false, with_code: false")
### Cloudinary image tag helper method
By default, the **Cloudinary image tag helper method** (e.g., <code>cl_image_tag in Ruby on Rails) automatically generates an HTML image tag including the image source URL{variable:videoTagFeatures}. 

The following shows the same transformations as above, but this time using the image tag to generate a complete HTML image tag.

![cl_image_tag](https://res.cloudinary.com/demo/image/upload/c_scale,h_100,w_300/sample.jpg "with_image: false, with_url: false")

```nodejs
cloudinary.image("sample.jpg", {height: 100, width: 300, crop: "scale"})
```

```react
new CloudinaryImage("sample.jpg").resize(scale().width(300).height(100));
```

```vue
new CloudinaryImage("sample.jpg").resize(scale().width(300).height(100));
```

```angular
new CloudinaryImage("sample.jpg").resize(scale().width(300).height(100));
```

```js
new CloudinaryImage("sample.jpg").resize(scale().width(300).height(100));
```

```python
CloudinaryImage("sample.jpg").image(height=100, width=300, crop="scale")
```

```php
(new ImageTag('sample.jpg'))
	->resize(Resize::scale()->width(300)
->height(100));
```

```java
cloudinary.url().transformation(new Transformation().height(100).width(300).crop("scale")).imageTag("sample.jpg");
```

```ruby
cl_image_tag("sample.jpg", height: 100, width: 300, crop: "scale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(100).Width(300).Crop("scale")).BuildImageTag("sample.jpg")
```

```dart
cloudinary.image('sample.jpg').transformation(Transformation()
	.resize(Resize.scale().width(300)
.height(100)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(100).setWidth(300).setCrop("scale")).generate("sample.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(100).width(300).crop("scale")).generate("sample.jpg");
```

```flutter
cloudinary.image('sample.jpg').transformation(Transformation()
	.resize(Resize.scale().width(300)
.height(100)));
```

```kotlin
cloudinary.image {
	publicId("sample.jpg")
	 resize(Resize.scale() { width(300)
 height(100) }) 
}.generate()
```

```jquery
$.cloudinary.image("sample.jpg", {height: 100, width: 300, crop: "scale"})
```

```react_native
new CloudinaryImage("sample.jpg").resize(scale().width(300).height(100));
```

![cloudinary_url example](https://res.cloudinary.com/demo/video/upload/b_blue,c_pad,h_300,w_300/glide-over-coastal-beach.mp4 "with_image: false, with_url: false")

```nodejs
cloudinary.video("glide-over-coastal-beach", {background: "blue", height: 300, width: 300, crop: "pad"})
```

```react
new CloudinaryVideo("glide-over-coastal-beach.mp4").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```vue
new CloudinaryVideo("glide-over-coastal-beach.mp4").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```angular
new CloudinaryVideo("glide-over-coastal-beach.mp4").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```js
new CloudinaryVideo("glide-over-coastal-beach.mp4").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

```python
CloudinaryVideo("glide-over-coastal-beach").video(background="blue", height=300, width=300, crop="pad")
```

```php
(new VideoTag('glide-over-coastal-beach.mp4'))
	->resize(Resize::pad()->width(300)
->height(300)
	->background(
	Background::color(Color::BLUE))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("blue").height(300).width(300).crop("pad")).videoTag("glide-over-coastal-beach");
```

```ruby
cl_video_tag("glide-over-coastal-beach", background: "blue", height: 300, width: 300, crop: "pad")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Background("blue").Height(300).Width(300).Crop("pad")).BuildVideoTag("glide-over-coastal-beach")
```

```dart
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.color(Color.BLUE))
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setBackground("blue").setHeight(300).setWidth(300).setCrop("pad")).generate("glide-over-coastal-beach.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().background("blue").height(300).width(300).crop("pad")).resourceType("video").generate("glide-over-coastal-beach.mp4");
```

```flutter
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.color(Color.BLUE))
	));
```

```kotlin
cloudinary.video {
	publicId("glide-over-coastal-beach.mp4")
	 resize(Resize.pad() { width(300)
 height(300)
	 background(
	Background.color(Color.BLUE))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("glide-over-coastal-beach", {background: "blue", height: 300, width: 300, crop: "pad"})
```

```react_native
new CloudinaryVideo("glide-over-coastal-beach.mp4").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("blue"))
);
```

This SDK code will output the following HTML code:

```
<img 
  src="https://res.cloudinary.com/demo/image/upload/c_scale,h_100,w_300/sample.jpg"
>
```
 
The Cloudinary Image Tag helper method allows you to not only specify any Cloudinary transformations parameters, but also to specify regular HTML image tag attributes (e.g., alt, title, width, height). For example, using the Image Tag helper method to create an HTML image tag for the `sample` image, with the 'alt' attribute set to "A sample photo" and the 'className' attribute set to "Samples":

```multi
|ruby
cl_image_tag("sample.jpg", alt: "A sample photo", className: "Samples")

|php_2
ImageTag::fromParams("sample.jpg", ["alt"=>"A sample photo", "className"=>"Samples"])

|python
CloudinaryImage("sample.jpg").image(alt="A sample photo", className="Samples")

|nodejs
cloudinary.image("sample.jpg", {alt: "A sample photo", className: "Samples"})

|java
cloudinary.url().imageTag("sample.jpg", ObjectUtils.asMap("alt","A sample photo","className","Samples"));

|csharp
@Model.Cloudinary.Api.UrlImgUp.BuildImageTag("sample.jpg", new CloudinaryDotNet.StringDictionary("alt=A sample photo", "className=Samples"));

|js
cl.imageTag('sample.jpg', {alt: "A sample photo", className: "Samples"}).toHtml();

|go
Not supported by this SDK

|jquery
$.cloudinary.image("sample.jpg", {alt: "A sample photo", className: "Samples"})

|react
<Image publicId="sample.jpg" alt="A sample photo" className="Samples">
</Image>

|vue
<CLDImage publicId="sample.jpg" alt="A sample photo" className="Samples">
</CLDImage>

|angular
<cl-image public-id="sample.jpg" alt="A sample photo" className="Samples">
</cl-image>
```

For more information on these SDK helper methods, see the transformation documentation in the relevant [SDK guide](cloudinary_sdks). 

> **TIP**:
>
> In general, when using an SDK, you will probably take advantage of the SDK parameter names for improved readability and maintenance of your code. However, you can also optionally pass a **raw_transformation** parameter, whose value is a literal [URL transformation](transformation_reference) definition. Note that the string you pass as the raw transformation value will be appended as is (with no processing or validation) to the **end** of any other transformation parameters passed in the same component of the transformation chain. 
> For example:
> ```multi

|ruby
cl_image_tag("flower.jpg", 
  transformation: [{raw_transformation: "o_90,w_1000,c_fill,g_south_east/l_my_image,fl_relative,w_1.0"}])

|php_2
cl_image_tag("sample.jpg", 
  ["raw_transformation" => "w_400,c_pad"]);


|python
CloudinaryImage("sample.jpg").image(
  transformation=[{"raw_transformation":"w_400,c_pad"}])

|go
img, err := cld.Image("sample.jpg")
img.Transformation = "w_400,c_pad"
url, err := img.String()

|nodejs
cloudinary.image("sample.jpg", { transformation: { raw_transformation: "w_400,c_pad" }})

|java
<cl:image src="sample.jpg" raw_transformation="w_100,h_150,c_fill"/>

// or
cloudinary.url()
  .transformation(new Transformation().rawTransformation("w_100,h_150,c_fill"))
  .imageTag("sample.jpg");

|csharp
@Model.Cloudinary.Api.UrlImgUp.Transform(
    new Transformation().RawTransformation("w_100,h_150,c_fill")).BuildImageTag("sample.jpg");

|js
cl.imageTag("sample.jpg", { raw_transformation: "w_400,c_pad" }}).toHtml();

|jquery
$.cloudinary.imageTag("sample.jpg", { raw_transformation: "w_400,c_pad" }}).toHtml();

|react
<Image publicId="mypic">
  <Transformation rawTransformation="h_150,w_150,c_fill,e_sepia,r_20" />
</Image>

|vue
<CLDImage publicId="sample.jpg" rawTransformation="w_150,h_150,c_fill">
</CLDImage>

|angular
<cl-image 
  public-id="mypic" 
  class="thumbnail inline" 
  format="jpg"
  raw-transformation="w_150,h_150,c_fill">
</cl-image>
```

## Image format support

Images can be uploaded to Cloudinary in various formats (input formats), and you can easily convert these images to other formats for displaying in your web site or application (output formats). Examples of situations where you might want to change the delivered image format:

* Delivering JPEG images for photos that you want to load quickly (or AVIF or WebP if your users are on a browser that supports these).
* Delivering a PNG (24 bit) for high quality illustrations with a transparent background.
* Delivering an image where the original format is not supported for delivery by the browser. For example, you could deliver a Photoshop (.psd) image as a JPEG.

> **TIP**: For image format optimization guidelines, see [How to optimize image format](image_optimization#how_to_optimize_image_format).

### Delivering in a different format

You can convert and deliver images in any [supported image format](#supported_image_formats) by specifying the required format as the file extension of the delivery URL. When using an SDK to build the URL, you can either append the extension of the new format to the asset's public ID or use the `format` parameter. 

For example, to display the uploaded `woman-business-suit` JPEG image as a PNG:

![Image converted to PNG](https://res.cloudinary.com/demo/image/upload/woman-business-suit.png "thumb: w_400")

```nodejs
cloudinary.image("woman-business-suit.png")
```

```react
new CloudinaryImage("woman-business-suit.png");
```

```vue
new CloudinaryImage("woman-business-suit.png");
```

```angular
new CloudinaryImage("woman-business-suit.png");
```

```js
new CloudinaryImage("woman-business-suit.png");
```

```python
CloudinaryImage("woman-business-suit.png").image()
```

```php
(new ImageTag('woman-business-suit.png'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("woman-business-suit.png");
```

```ruby
cl_image_tag("woman-business-suit.png")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("woman-business-suit.png")
```

```dart
cloudinary.image('woman-business-suit.png').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("woman-business-suit.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("woman-business-suit.png");
```

```flutter
cloudinary.image('woman-business-suit.png').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("woman-business-suit.png") 
}.generate()
```

```jquery
$.cloudinary.image("woman-business-suit.png")
```

```react_native
new CloudinaryImage("woman-business-suit.png");
```

&nbsp;You can combine other image transformations with format conversion. For example, to deliver the same image as a PNG, but this time removing the background and converting the image to grayscale:

![Image converted to PNG and removing the background](https://res.cloudinary.com/demo/image/upload/e_background_removal/e_grayscale/woman-business-suit.png "thumb: w_400")

```nodejs
cloudinary.image("woman-business-suit.png", {transformation: [
  {effect: "background_removal"},
  {effect: "grayscale"}
  ]})
```

```react
new CloudinaryImage("woman-business-suit.png")
  .effect(backgroundRemoval())
  .effect(grayscale());
```

```vue
new CloudinaryImage("woman-business-suit.png")
  .effect(backgroundRemoval())
  .effect(grayscale());
```

```angular
new CloudinaryImage("woman-business-suit.png")
  .effect(backgroundRemoval())
  .effect(grayscale());
```

```js
new CloudinaryImage("woman-business-suit.png")
  .effect(backgroundRemoval())
  .effect(grayscale());
```

```python
CloudinaryImage("woman-business-suit.png").image(transformation=[
  {'effect': "background_removal"},
  {'effect': "grayscale"}
  ])
```

```php
(new ImageTag('woman-business-suit.png'))
	->effect(Effect::backgroundRemoval())
	->effect(Effect::grayscale());
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("background_removal").chain()
  .effect("grayscale")).imageTag("woman-business-suit.png");
```

```ruby
cl_image_tag("woman-business-suit.png", transformation: [
  {effect: "background_removal"},
  {effect: "grayscale"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("background_removal").Chain()
  .Effect("grayscale")).BuildImageTag("woman-business-suit.png")
```

```dart
cloudinary.image('woman-business-suit.png').transformation(Transformation()
	.effect(Effect.backgroundRemoval())
	.effect(Effect.grayscale()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("background_removal").chain()
  .setEffect("grayscale")).generate("woman-business-suit.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("background_removal").chain()
  .effect("grayscale")).generate("woman-business-suit.png");
```

```flutter
cloudinary.image('woman-business-suit.png').transformation(Transformation()
	.effect(Effect.backgroundRemoval())
	.effect(Effect.grayscale()));
```

```kotlin
cloudinary.image {
	publicId("woman-business-suit.png")
	 effect(Effect.backgroundRemoval())
	 effect(Effect.grayscale()) 
}.generate()
```

```jquery
$.cloudinary.image("woman-business-suit.png", {transformation: [
  {effect: "background_removal"},
  {effect: "grayscale"}
  ]})
```

```react_native
new CloudinaryImage("woman-business-suit.png")
  .effect(backgroundRemoval())
  .effect(grayscale());
```

Another option for changing the format is to explicitly call the `fetch_format` transformation parameter (`f` in URLs). This can be useful in situations where you cannot change the file extension, for example, when [fetching remote assets](fetch_remote_images) that already have a different file extension (format) as part of their URLs.

For example, to fetch a remote image from Wikimedia in PNG format, and deliver the image in JPEG format (also scaled down to a width of 400 pixels):

![Benedict_Cumberbatch fetched from Wikimedia and delivered as a PNG](https://res.cloudinary.com/demo/image/fetch/c_scale,h_400/f_jpg/https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png)

```nodejs
cloudinary.image("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png", {type: "fetch", transformation: [
  {height: 400, crop: "scale"},
  {fetch_format: "jpg"}
  ]})
```

```react
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png"
)
  .resize(scale().height(400))
  .delivery(format(jpg()))
  .setDeliveryType("fetch");
```

```vue
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png"
)
  .resize(scale().height(400))
  .delivery(format(jpg()))
  .setDeliveryType("fetch");
```

```angular
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png"
)
  .resize(scale().height(400))
  .delivery(format(jpg()))
  .setDeliveryType("fetch");
```

```js
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png"
)
  .resize(scale().height(400))
  .delivery(format(jpg()))
  .setDeliveryType("fetch");
```

```python
CloudinaryImage("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png").image(type="fetch", transformation=[
  {'height': 400, 'crop': "scale"},
  {'fetch_format': "jpg"}
  ])
```

```php
(new ImageTag('https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'))
	->resize(Resize::scale()->height(400))
	->delivery(Delivery::format(
	Format::jpg()))
	->deliveryType("fetch");
```

```java
cloudinary.url().transformation(new Transformation()
  .height(400).crop("scale").chain()
  .fetchFormat("jpg")).type("fetch").imageTag("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png");
```

```ruby
cl_image_tag("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png", type: "fetch", transformation: [
  {height: 400, crop: "scale"},
  {fetch_format: "jpg"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(400).Crop("scale").Chain()
  .FetchFormat("jpg")).Action("fetch").BuildImageTag("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png")
```

```dart
cloudinary.image('https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png').transformation(Transformation()
	.resize(Resize.scale().height(400))
	.delivery(Delivery.format(
	Format.jpg()))
	.setDeliveryType("fetch"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setType( "fetch").setTransformation(CLDTransformation()
  .setHeight(400).setCrop("scale").chain()
  .setFetchFormat("jpg")).generate("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(400).crop("scale").chain()
  .fetchFormat("jpg")).type("fetch").generate("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png");
```

```flutter
cloudinary.image('https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png').transformation(Transformation()
	.resize(Resize.scale().height(400))
	.delivery(Delivery.format(
	Format.jpg()))
	.setDeliveryType("fetch"));
```

```kotlin
cloudinary.image {
	publicId("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png")
	 resize(Resize.scale() { height(400) })
	 delivery(Delivery.format(
	Format.jpg()))
	 deliveryType("fetch") 
}.generate()
```

```jquery
$.cloudinary.image("https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png", {type: "fetch", transformation: [
  {height: 400, crop: "scale"},
  {fetch_format: "jpg"}
  ]})
```

```react_native
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png"
)
  .resize(scale().height(400))
  .delivery(format(jpg()))
  .setDeliveryType("fetch");
```

> **NOTES**:
>
> * If the file extension is omitted in a delivery URL, the file is delivered in the originally uploaded format unless a specific format (or the [auto](image_optimization#automatic_format_selection_f_auto) format is requested using the `fetch_format` (`f_`) transformation parameter).

> * When converting from one multi-page or multi-layer image format (PDF, GIF, WebP, TIFF, PSD) to another, only the first 100 pages are included in the new file. 

> * SDK **major versions** with initial release later than January 2020 have a `format` transformation parameter, instead of the `fetch_format` parameter. See [f (format)](transformation_reference#f_supported_format) in the transformation reference.

### f_auto
You can take advantage of Cloudinary's automatic format selection (`f_auto`) transformation to automatically deliver images in the most optimized format that's supported by the requesting browser.

For example, if you deliver a JPEG image with `f_auto`, Cloudinary might generate and deliver the image as a WebP, AVIF or JPEG XL file, depending on the requesting browser and your account setup.  The `f_auto` algorithm will similarly deliver the best format when the original asset is a PNG (with or without transparency), an animated GIF, etc. 

For details, see [Automatic format selection (f_auto)](image_optimization#automatic_format_selection_f_auto) and [Tips and considerations for using f_auto](image_optimization#tips_and_considerations_for_using_f_auto).

### Supported image formats
The table below summarizes the supported image formats.

Format | Extensions | Supported for Upload 1 | Supported for Transformations 2
--- | --- | --- | --- 
**3DS** | .3ds | Yes | Yes
**AI** (Adobe Illustrator) | .ai | Yes | Yes
**animated AVIF** | .avif | No | Yes 6
**animated GIF** | .gif | Yes | Yes
**animated PNG** | .png | Yes | Yes
**animated WebP** | .webp | Yes | Yes
**AVIF** | .avif | Yes | Yes 6
**BMP**| .bmp | Yes | Yes
**BW** (Browzwear file) | .bw | Yes | Yes
**DjVu** | .djvu | Yes | No
**DNG** (Digital Negative) | .dng | Yes | No
**EPS** (Encapsulated PostScript) | .ps, .ept, .eps, .eps3 | Yes | Yes
**FBX** (Filmbox) | .fbx 7 | Yes 5 | Yes
**FLIF** (Free Lossless Image Format) | .flif | Yes | Yes
**GIF** | .gif | Yes | Yes
**GLB** (Binary glTF) | .glb | Yes | Yes 
**glTF** (GL Transmission Format) | .gltf | Yes 5 | Yes 
**HEIF** | .heif, .heic | Yes  | Yes
**ICO** | .ico | Yes | Yes
**InDesign** | .indd | Yes | Yes 3
**JPEG** | .jpg, .jpe, .jpeg | Yes | Yes
**JPEG 2000** | .jp2 | Yes | Yes
**JPEG XR** (JPEG eXtended Range) | .wdp, .jxr, .hdp | Yes | Yes
**JXL** (JPEG XL) | .jxl | Yes | Yes
**OBJ** | .obj 7| Yes | Yes
**PDF** | .pdf | Yes | Yes
**PLY** | .ply | Yes | Yes
**PNG**  | .png | Yes | Yes
**PSD** (Photoshop Document) | .psd | Yes | Yes 4
**Raw image files** | .arw, .cr2, .cr3 | Yes | No
**SVG** | .svg | Yes | Yes
**TARGA** (Truevision TGA) | .tga | Yes | Yes
**TIFF** | .tif, .tiff | Yes | Yes
**U3MA** (Fabric file) | .u3ma | Yes 5 | Yes
**USDZ** | .usdz | Yes | Yes
**WebP** | .webp | Yes | Yes
> **NOTES**: :title=Footnotes

1. If a format is supported only for upload, then the delivery URL enables a user to download the original file in its original format, but you cannot apply transformation parameters.
2. If a format is supported for transformations, but the browser doesn't support displaying that format, you can either provide the transformation URL with the original format to enable users to download the file, or you can provide the URL with a different delivery format specified. In that case, Cloudinary applies the transformation to the original format and then converts the image to the requested format for delivery. For example, you could provide a transformation URL for a Photoshop (.psd) image and specify `jpg` as the delivery format to display the resulting transformation in the browser.
3. You can transform an InDesign file if you deliver it as an image format, such as `jpg` or `png`, but you cannot deliver an `indd` file with transformations.
4. All layers are flattened into a single image if no `page` parameter is specified.
5. Certain 3D file formats are supported for [upload within a zip file](upload_parameters#uploading_3d_models) containing other required files for the model, such as textures etc. Some transformations, such as converting to a video or image, are supported on the bundle as a whole. No transformations are currently supported on its contained assets. For further information see [Transformations on 3D models](transformations_on_3d_models). 
6. Images converted to AVIF and animated AVIF from other formats use [additional quota](transformation_counts#avif_calculation). Images exceeding 30 megapixels cannot be encoded to AVIF - ensure you [scale them down](resizing_and_cropping#scale) first. You can [request to enable](https://support.cloudinary.com/hc/en-us/requests/new) AVIF and animated AVIF as possible formats to be delivered when [automatic format selection](image_optimization#automatic_format_selection_f_auto) (`f_auto`) is used. 
7. You cannot [convert a 3D model](transformations_on_3d_models#delivering_3d_models_in_different_3d_formats) of a different format to FBX or OBJ.

## Image transformation types

This page walked you through the basics of how image transformations work. The rest of the pages in this guide provide details, use cases and examples of the many different types of transformations you can apply to the images you deliver:

Transformation type | Description
--- | ---
[Resizing and cropping](resizing_and_cropping) | Resize (crop and/or scale) images server-side before delivering them.
[Placing layers on images](layers) | Place image, text, or other layers on (or under) existing assets to generate new and customized creations on the fly.
[Effects and enhancements](effects_and_artistic_enhancements) | Apply a huge variety of effects, filters, and other artistic enhancements to any image.
[Background removal](background_removal) | Use AI to remove image backgrounds.
[Generative AI transformations](generative_ai_transformations) | Use generative AI to transform your images, naturally extending dimensions, removing and replacing objects, generating new backgrounds and more.
[Face-detection based transformations](face_detection_based_transformations) | Transform an image based on detected faces.
[Animated image transformations](animated_images) | Create animated images from multiple images in your product environment, convert them to video, convert between animated formats, and apply animation-specific transformations.
[3D models](transformations_on_3d_models) | Learn how to perform transformations on 3D models.
[Conditional transformations](conditional_transformations) | Apply a transformation only if a specified condition is met.
[User-defined variables and arithmetic transformations](user_defined_variables) | Use arithmetic expressions and variables to add additional sophistication and flexibility to your transformations.
[Custom functions](custom_functions) | Inject a remote, lambda or WebAssembly function and apply the result as a transformation.

## Delivering optimized and responsive media

In addition to changing the appearance of your media assets by transforming them, you can also use Cloudinary URLs and a variety of parameters to control how they're delivered:

Topic | Description
--- | ---
[Optimizations](image_optimization)| Deliver your media assets with the smallest possible file size while maintaining visual quality, saving bandwidth and improving performance for your website. This includes automatic quality and format selection optimizations ([q_auto](image_optimization#automatic_quality_selection_q_auto) and [f_auto](image_optimization#automatic_format_selection_f_auto)).
[Responsive images](responsive_images) | Deliver your images to perfectly fit any device, viewport size, orientation, or resolution at any pixel density (DPR). Upload a single high resolution image and let Cloudinary automatically transform it.
[Deliver remote media files](fetch_remote_images) and [Social media profile pictures](social_media_profile_pictures) | Grab media assets from anywhere on the web or pull social media profile pictures from a variety of popular social media networks, including support for on-the-fly transformation and optimized delivery via a CDN.
[PDF and Photoshop files](paged_and_layered_media) | Deliver content from assets with multiple pages or layers such as PDFs or Photoshop files, including options for delivering or transforming only selected pages or layers.
[Access control](control_access_to_media) | Control who can access your media, both the originals and transformed assets, including enabling strict transformations, using signed delivery URLs, uploading images as private or authenticated, and using `access_control` to control who can access an asset without adjusting the URL.
[Advanced URL delivery options](advanced_url_delivery_options) |Take advantage of advanced options that make your URLs more SEO-friendly, deliver assets using private CDNs or multi-CDN solutions, use custom delivery hostnames (CNAMEs) for your URLs, define custom favicons, work with asset versions, and more.

## Create new images
Cloudinary provides a variety of methods to create new assets in your product environment.

> **NOTE**: These methods create new assets in your product environment with their own public IDs, as opposed to the assets that are generated (derived) when using transformations, which are cached in the CDN, but aren't stored in your product environment with their own public IDs.
Topic | Description
---|---
[Animated images](creating_animated_images) | Create a single animated image from multiple image assets, where each asset is used as a single frame of the resulting animated image.
[PDF files from images](create_pdf_files_from_images) | Create a PDF from multiple image assets, where each asset is used as a single frame of the resulting PDF file.
[Images from text](create_images_from_text) | Create an image of a given textual string and customize the look & feel of the resulting image with various font, color and style parameters. 
> **INFO**:
>
> The **Sprite** feature and the **Image Collage** feature using the `create_collage` method will be deprecated as of **September 16, 2025**, and will no longer function after that date. Be sure to remove these features from any production code.
> You can continue creating collages using [overlays](image_collage_generation#create_collages_using_overlays).
> **READING**:
>
> While learning about transformations, you may also want to check out: 

> * [Transformation URL API Reference](transformation_reference): Details all available transformation parameters. Icons indicate which parameters are supported for each asset type.

> * [Video transformations guide](video_manipulation_and_delivery):  Provides details and examples of the transformations you can apply to video assets.

> * [Transformation basics video tutorial](transformation_basics_tutorial): Watch a quick video on how these dynamic transformation URLs work.

> * [How are transformations counted?](transformation_counts): Details how various transformations are counted for monthly billing.
