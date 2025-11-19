# Image effects and enhancements


Cloudinary's visual effects and enhancements are a great way to easily change the way your images look within your site or application. For example, you can change the shape of your images, blur and pixelate them, apply quality improvements, make color adjustments, change the look and feel with fun effects, apply filters, and much more. You can also apply multiple effects to an image by applying each effect as a separate [chained transformation](image_transformations#chained_transformations).

Some transformations use fairly [simple syntax](#simple_syntax_examples), whereas others require more explanation - examples of these types of transformations are shown in the [advanced syntax examples](#advanced_syntax_examples). 

Besides the examples on this page, there are many more effects available and you can find a full list of them, including examples, by checking out our [URL transformation reference](transformation_reference).

Here are some popular options for using effects and artistic enhancements. Click each image to see the URL parameters applied in each case:

Cartoonify your images

Add a vignette toyour images

Generate low qualityimage placeholders

Add image outlines

## Simple syntax examples

Here are some examples of effects and enhancements that use a simple transformation syntax.  Click the links to see the full syntax for each transformation in the URL transformation reference.

### Artistic filters
Apply an artistic filter using the `art` effect, specifying one of the filters shown.

#### Available filters

**Original image:**
![Original image, no filter](https://res.cloudinary.com/demo/image/upload/v1690194782/docs/diy-house.jpg "with_code: false, with_url: false, thumb: w_300")

**Filters:**

al_dente 

athena 

audrey 

aurora 

daguerre 

eucalyptus 

fes 

frost 

hairspray 

hokusai 

incognito 

linen 

peacock 

primavera 

quartz 

red_rock 

refresh 

sizzle 

sonnet 

ukulele 

zorro 

![incognito art filter](https://res.cloudinary.com/demo/image/upload/e_art:zorro/docs/diy-house.jpg "with_image: false")

```nodejs
cloudinary.image("docs/diy-house.jpg", {effect: "art:zorro"})
```

```react
new CloudinaryImage("docs/diy-house.jpg").effect(artisticFilter("zorro"));
```

```vue
new CloudinaryImage("docs/diy-house.jpg").effect(artisticFilter("zorro"));
```

```angular
new CloudinaryImage("docs/diy-house.jpg").effect(artisticFilter("zorro"));
```

```js
new CloudinaryImage("docs/diy-house.jpg").effect(artisticFilter("zorro"));
```

```python
CloudinaryImage("docs/diy-house.jpg").image(effect="art:zorro")
```

```php
(new ImageTag('docs/diy-house.jpg'))
	->effect(Effect::artisticFilter(
	ArtisticFilter::zorro()));
```

```java
cloudinary.url().transformation(new Transformation().effect("art:zorro")).imageTag("docs/diy-house.jpg");
```

```ruby
cl_image_tag("docs/diy-house.jpg", effect: "art:zorro")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("art:zorro")).BuildImageTag("docs/diy-house.jpg")
```

```dart
cloudinary.image('docs/diy-house.jpg').transformation(Transformation()
	.effect(Effect.artisticFilter(
	ArtisticFilter.zorro())));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("art:zorro")).generate("docs/diy-house.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("art:zorro")).generate("docs/diy-house.jpg");
```

```flutter
cloudinary.image('docs/diy-house.jpg').transformation(Transformation()
	.effect(Effect.artisticFilter(
	ArtisticFilter.zorro())));
```

```kotlin
cloudinary.image {
	publicId("docs/diy-house.jpg")
	 effect(Effect.artisticFilter(
	ArtisticFilter.zorro())) 
}.generate()
```

```jquery
$.cloudinary.image("docs/diy-house.jpg", {effect: "art:zorro"})
```

```react_native
new CloudinaryImage("docs/diy-house.jpg").effect(artisticFilter("zorro"));
```

**See full syntax**: [e_art](transformation_reference#e_art) in the _Transformation Reference_.

### Cartoonify

Make an image look more like a cartoon using the `cartoonify` effect.

![Image with cartoonify effect](https://res.cloudinary.com/demo/image/upload/e_cartoonify/docs/rmv_bgd/stuffed_orig.jpg "thumb: w_300")

```nodejs
cloudinary.image("docs/rmv_bgd/stuffed_orig.jpg", {effect: "cartoonify"})
```

```react
new CloudinaryImage("docs/rmv_bgd/stuffed_orig.jpg").effect(cartoonify());
```

```vue
new CloudinaryImage("docs/rmv_bgd/stuffed_orig.jpg").effect(cartoonify());
```

```angular
new CloudinaryImage("docs/rmv_bgd/stuffed_orig.jpg").effect(cartoonify());
```

```js
new CloudinaryImage("docs/rmv_bgd/stuffed_orig.jpg").effect(cartoonify());
```

```python
CloudinaryImage("docs/rmv_bgd/stuffed_orig.jpg").image(effect="cartoonify")
```

```php
(new ImageTag('docs/rmv_bgd/stuffed_orig.jpg'))
	->effect(Effect::cartoonify());
```

```java
cloudinary.url().transformation(new Transformation().effect("cartoonify")).imageTag("docs/rmv_bgd/stuffed_orig.jpg");
```

```ruby
cl_image_tag("docs/rmv_bgd/stuffed_orig.jpg", effect: "cartoonify")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("cartoonify")).BuildImageTag("docs/rmv_bgd/stuffed_orig.jpg")
```

```dart
cloudinary.image('docs/rmv_bgd/stuffed_orig.jpg').transformation(Transformation()
	.effect(Effect.cartoonify()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("cartoonify")).generate("docs/rmv_bgd/stuffed_orig.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("cartoonify")).generate("docs/rmv_bgd/stuffed_orig.jpg");
```

```flutter
cloudinary.image('docs/rmv_bgd/stuffed_orig.jpg').transformation(Transformation()
	.effect(Effect.cartoonify()));
```

```kotlin
cloudinary.image {
	publicId("docs/rmv_bgd/stuffed_orig.jpg")
	 effect(Effect.cartoonify()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/rmv_bgd/stuffed_orig.jpg", {effect: "cartoonify"})
```

```react_native
new CloudinaryImage("docs/rmv_bgd/stuffed_orig.jpg").effect(cartoonify());
```

**See full syntax**: [e_cartoonify](transformation_reference#e_cartoonify) in the _Transformation Reference_.

### Opacity
Adjust the opacity of an image using the opacity transformation (`o` in URLs). Specify a value between 0 and 100, representing the percentage of transparency, where 100 means completely opaque and 0 is completely transparent. In this case the image is delivered with 30% opacity:

![Image delivered with 30% opacity](https://res.cloudinary.com/demo/image/upload/o_30/docs/eye-closeup.jpg "thumb: w_300")

```nodejs
cloudinary.image("docs/eye-closeup.jpg", {opacity: 30})
```

```react
new CloudinaryImage("docs/eye-closeup.jpg").adjust(opacity(30));
```

```vue
new CloudinaryImage("docs/eye-closeup.jpg").adjust(opacity(30));
```

```angular
new CloudinaryImage("docs/eye-closeup.jpg").adjust(opacity(30));
```

```js
new CloudinaryImage("docs/eye-closeup.jpg").adjust(opacity(30));
```

```python
CloudinaryImage("docs/eye-closeup.jpg").image(opacity=30)
```

```php
(new ImageTag('docs/eye-closeup.jpg'))
	->adjust(Adjust::opacity(30));
```

```java
cloudinary.url().transformation(new Transformation().opacity(30)).imageTag("docs/eye-closeup.jpg");
```

```ruby
cl_image_tag("docs/eye-closeup.jpg", opacity: 30)
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Opacity(30)).BuildImageTag("docs/eye-closeup.jpg")
```

```dart
cloudinary.image('docs/eye-closeup.jpg').transformation(Transformation()
	.adjust(Adjust.opacity(30)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setOpacity(30)).generate("docs/eye-closeup.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().opacity(30)).generate("docs/eye-closeup.jpg");
```

```flutter
cloudinary.image('docs/eye-closeup.jpg').transformation(Transformation()
	.adjust(Adjust.opacity(30)));
```

```kotlin
cloudinary.image {
	publicId("docs/eye-closeup.jpg")
	 adjust(Adjust.opacity(30)) 
}.generate()
```

```jquery
$.cloudinary.image("docs/eye-closeup.jpg", {opacity: 30})
```

```react_native
new CloudinaryImage("docs/eye-closeup.jpg").adjust(opacity(30));
```

**See full syntax**: [o (opacity)](transformation_reference#o_opacity) in the _Transformation Reference_.

### Pixelate

Pixelate an image using the `pixelate` effect. 

![Pixelated image](https://res.cloudinary.com/demo/image/upload/e_pixelate:20/docs/flower_shop.jpg "thumb: w_300")

```nodejs
cloudinary.image("docs/flower_shop.jpg", {effect: "pixelate:20"})
```

```react
new CloudinaryImage("docs/flower_shop.jpg").effect(pixelate().squareSize(20));
```

```vue
new CloudinaryImage("docs/flower_shop.jpg").effect(pixelate().squareSize(20));
```

```angular
new CloudinaryImage("docs/flower_shop.jpg").effect(pixelate().squareSize(20));
```

```js
new CloudinaryImage("docs/flower_shop.jpg").effect(pixelate().squareSize(20));
```

```python
CloudinaryImage("docs/flower_shop.jpg").image(effect="pixelate:20")
```

```php
(new ImageTag('docs/flower_shop.jpg'))
	->effect(Effect::pixelate()->squareSize(20));
```

```java
cloudinary.url().transformation(new Transformation().effect("pixelate:20")).imageTag("docs/flower_shop.jpg");
```

```ruby
cl_image_tag("docs/flower_shop.jpg", effect: "pixelate:20")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("pixelate:20")).BuildImageTag("docs/flower_shop.jpg")
```

```dart
cloudinary.image('docs/flower_shop.jpg').transformation(Transformation()
	.effect(Effect.pixelate().squareSize(20)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("pixelate:20")).generate("docs/flower_shop.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("pixelate:20")).generate("docs/flower_shop.jpg");
```

```flutter
cloudinary.image('docs/flower_shop.jpg').transformation(Transformation()
	.effect(Effect.pixelate().squareSize(20)));
```

```kotlin
cloudinary.image {
	publicId("docs/flower_shop.jpg")
	 effect(Effect.pixelate() { squareSize(20) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/flower_shop.jpg", {effect: "pixelate:20"})
```

```react_native
new CloudinaryImage("docs/flower_shop.jpg").effect(pixelate().squareSize(20));
```

**See full syntax**: [e_pixelate](transformation_reference#e_pixelate) in the _Transformation Reference_.

### Sepia

Change the colors of an image to shades of sepia using the `sepia` effect.

![Sepia effect applied to an image](https://res.cloudinary.com/demo/image/upload/e_sepia/docs/couple-rocks.jpg "thumb: w_300")

```nodejs
cloudinary.image("docs/couple-rocks.jpg", {effect: "sepia"})
```

```react
new CloudinaryImage("docs/couple-rocks.jpg").effect(sepia());
```

```vue
new CloudinaryImage("docs/couple-rocks.jpg").effect(sepia());
```

```angular
new CloudinaryImage("docs/couple-rocks.jpg").effect(sepia());
```

```js
new CloudinaryImage("docs/couple-rocks.jpg").effect(sepia());
```

```python
CloudinaryImage("docs/couple-rocks.jpg").image(effect="sepia")
```

```php
(new ImageTag('docs/couple-rocks.jpg'))
	->effect(Effect::sepia());
```

```java
cloudinary.url().transformation(new Transformation().effect("sepia")).imageTag("docs/couple-rocks.jpg");
```

```ruby
cl_image_tag("docs/couple-rocks.jpg", effect: "sepia")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("sepia")).BuildImageTag("docs/couple-rocks.jpg")
```

```dart
cloudinary.image('docs/couple-rocks.jpg').transformation(Transformation()
	.effect(Effect.sepia()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("sepia")).generate("docs/couple-rocks.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("sepia")).generate("docs/couple-rocks.jpg");
```

```flutter
cloudinary.image('docs/couple-rocks.jpg').transformation(Transformation()
	.effect(Effect.sepia()));
```

```kotlin
cloudinary.image {
	publicId("docs/couple-rocks.jpg")
	 effect(Effect.sepia()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/couple-rocks.jpg", {effect: "sepia"})
```

```react_native
new CloudinaryImage("docs/couple-rocks.jpg").effect(sepia());
```

**See full syntax**: [e_sepia](transformation_reference#e_sepia) in the _Transformation Reference_.
### Vignette

Fade the edges of images into the background using the `vignette` effect.

![Models image with vignette](https://res.cloudinary.com/demo/image/upload/e_vignette/women-pantsuits-steps.png "thumb: w_350")

```nodejs
cloudinary.image("women-pantsuits-steps.png", {effect: "vignette"})
```

```react
new CloudinaryImage("women-pantsuits-steps.png").effect(vignette());
```

```vue
new CloudinaryImage("women-pantsuits-steps.png").effect(vignette());
```

```angular
new CloudinaryImage("women-pantsuits-steps.png").effect(vignette());
```

```js
new CloudinaryImage("women-pantsuits-steps.png").effect(vignette());
```

```python
CloudinaryImage("women-pantsuits-steps.png").image(effect="vignette")
```

```php
(new ImageTag('women-pantsuits-steps.png'))
	->effect(Effect::vignette());
```

```java
cloudinary.url().transformation(new Transformation().effect("vignette")).imageTag("women-pantsuits-steps.png");
```

```ruby
cl_image_tag("women-pantsuits-steps.png", effect: "vignette")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("vignette")).BuildImageTag("women-pantsuits-steps.png")
```

```dart
cloudinary.image('women-pantsuits-steps.png').transformation(Transformation()
	.effect(Effect.vignette()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("vignette")).generate("women-pantsuits-steps.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("vignette")).generate("women-pantsuits-steps.png");
```

```flutter
cloudinary.image('women-pantsuits-steps.png').transformation(Transformation()
	.effect(Effect.vignette()));
```

```kotlin
cloudinary.image {
	publicId("women-pantsuits-steps.png")
	 effect(Effect.vignette()) 
}.generate()
```

```jquery
$.cloudinary.image("women-pantsuits-steps.png", {effect: "vignette"})
```

```react_native
new CloudinaryImage("women-pantsuits-steps.png").effect(vignette());
```

![Hotel buffet video with vignette](https://res.cloudinary.com/demo/video/upload/e_vignette/docs/hotel_buffet.mp4 "thumb: w_600")

```nodejs
cloudinary.video("docs/hotel_buffet", {effect: "vignette"})
```

```react
new CloudinaryVideo("docs/hotel_buffet.mp4").effect(vignette());
```

```vue
new CloudinaryVideo("docs/hotel_buffet.mp4").effect(vignette());
```

```angular
new CloudinaryVideo("docs/hotel_buffet.mp4").effect(vignette());
```

```js
new CloudinaryVideo("docs/hotel_buffet.mp4").effect(vignette());
```

```python
CloudinaryVideo("docs/hotel_buffet").video(effect="vignette")
```

```php
(new VideoTag('docs/hotel_buffet.mp4'))
	->effect(Effect::vignette());
```

```java
cloudinary.url().transformation(new Transformation().effect("vignette")).videoTag("docs/hotel_buffet");
```

```ruby
cl_video_tag("docs/hotel_buffet", effect: "vignette")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Effect("vignette")).BuildVideoTag("docs/hotel_buffet")
```

```dart
cloudinary.video('docs/hotel_buffet.mp4').transformation(Transformation()
	.effect(Effect.vignette()));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setEffect("vignette")).generate("docs/hotel_buffet.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().effect("vignette")).resourceType("video").generate("docs/hotel_buffet.mp4");
```

```flutter
cloudinary.video('docs/hotel_buffet.mp4').transformation(Transformation()
	.effect(Effect.vignette()));
```

```kotlin
cloudinary.video {
	publicId("docs/hotel_buffet.mp4")
	 effect(Effect.vignette()) 
}.generate()
```

```jquery
$.cloudinary.video("docs/hotel_buffet", {effect: "vignette"})
```

```react_native
new CloudinaryVideo("docs/hotel_buffet.mp4").effect(vignette());
```

**See full syntax**: [e_vignette](transformation_reference#e_vignette) in the _Transformation Reference_.
> **NOTE**: When you use the vignette effect with PNG images, it usually blends seamlessly. But with other formats like JPEG, there could be a visible white background surrounding the vignette in areas where the image is transparent when displaying the image against a non-white background.

### Image enhancement options

Cloudinary offers various way to enhance your images. This table explains the difference between them, and below you can see examples of each.

{table:class=no-borders overview}Transformation | Purpose | Key features | Main use cases | How it works
--|--|--|--|--
Generative restore([e_gen_restore](transformation_reference#e_gen_restore)) | Excels in revitalizing images affected by digital manipulation and compression. |  ✅ **Compression Artifact Removal**: Effectively eliminates JPEG blockiness and overshoot due to compression. ✅ **Noise Reduction**: Smoothens grainy images for a cleaner visual. ✅ **Image Sharpening**: Boosts clarity and detail in blurred images. |  ✅ Over-compressed images.✅ User-generated content.✅ Restoring vintage photos.| Utilizes generative AI to recover and refine lost image details.
Upscale([e_upscale](transformation_reference#e_upscale)) | Increases the resolution of an image using AI, with special attention to faces. | ✅ Enhances clarity and detail while upscaling.✅ Specialized face detection and enhancement.✅ Preserves the natural look of faces. | ✅ Improving the quality of low resolution images, especially those with human faces. | Analyzes the image, with additional logic applied to faces, to predict necessary pixels.
Enhance([e_enhance](transformation_reference#e_enhance)) | Enhances the overall appeal of images without altering content using AI. | ✅ Improves exposure, color balance, and white balance.✅ Enhances the general look of an image. | ✅ Any images requiring a quality boost.✅ User-generated content. | An AI model analyzes and applies various operators to enhance the image.
Improve([e_improve](transformation_reference#e_improve)) | Automatically improves images by adjusting colors, contrast, and lighting. | ✅ Enhances overall visual quality.✅ Adjusts colors, contrast, and lighting. | ✅ Enhancing user-generated content.✅ Any images requiring a quality boost. | Applies an automatic enhancement filter to the image.

> **TIP**:
>
> :title=See image enhancement options being applied:

> * Watch a [video tutorial](enhance_and_restore_images_tutorial) showing how to apply them in a React app.

> * Take a look at the [profile picture sample project](profile_picture_sample_project), which demonstrates applying these options following quality analysis in a Next.js app.

#### Generative restore

This example shows how the generative restore effect can enhance the details of a highly compressed image:

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

  
  

**Try it out**: [Generative restore](https://console.cloudinary.com/app/image/home/generative-restore?media=image&sample=me%2Frestore-1).

#### Upscale

This example shows how the `upscale` effect can preserve the details of a low resolution image when upscaling:

![Photo of escalators with the upscale effect applied](https://res.cloudinary.com/demo/image/upload/e_upscale/docs/escalator-200.jpg "with_image: false")

```nodejs
cloudinary.image("docs/escalator-200.jpg", {effect: "upscale"})
```

```react
new CloudinaryImage("docs/escalator-200.jpg").effect(upscale());
```

```vue
new CloudinaryImage("docs/escalator-200.jpg").effect(upscale());
```

```angular
new CloudinaryImage("docs/escalator-200.jpg").effect(upscale());
```

```js
new CloudinaryImage("docs/escalator-200.jpg").effect(upscale());
```

```python
CloudinaryImage("docs/escalator-200.jpg").image(effect="upscale")
```

```php
(new ImageTag('docs/escalator-200.jpg'))
	->effect(Effect::upscale());
```

```java
cloudinary.url().transformation(new Transformation().effect("upscale")).imageTag("docs/escalator-200.jpg");
```

```ruby
cl_image_tag("docs/escalator-200.jpg", effect: "upscale")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("upscale")).BuildImageTag("docs/escalator-200.jpg")
```

```dart
cloudinary.image('docs/escalator-200.jpg').transformation(Transformation()
	.effect(Effect.upscale()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("upscale")).generate("docs/escalator-200.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("upscale")).generate("docs/escalator-200.jpg");
```

```flutter
cloudinary.image('docs/escalator-200.jpg').transformation(Transformation()
	.effect(Effect.upscale()));
```

```kotlin
cloudinary.image {
	publicId("docs/escalator-200.jpg")
	 effect(Effect.upscale()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/escalator-200.jpg", {effect: "upscale"})
```

```react_native
new CloudinaryImage("docs/escalator-200.jpg").effect(upscale());
```

  
  

**Try it out**: [Upscale](https://console.cloudinary.com/app/image/home/upscale?media=image&collection=signs&sample=me%2Fupscale-sign-1).

#### Enhance

This example shows how the `enhance` effect can improve the lighting of an under exposed image:

![Woman in the dark with improved exposure](https://res.cloudinary.com/demo/image/upload/e_enhance/docs/under-exposed.jpg "with_image: false")

```nodejs
cloudinary.image("docs/under-exposed.jpg", {effect: "enhance"})
```

```react
new CloudinaryImage("docs/under-exposed.jpg").effect(enhance());
```

```vue
new CloudinaryImage("docs/under-exposed.jpg").effect(enhance());
```

```angular
new CloudinaryImage("docs/under-exposed.jpg").effect(enhance());
```

```js
new CloudinaryImage("docs/under-exposed.jpg").effect(enhance());
```

```python
CloudinaryImage("docs/under-exposed.jpg").image(effect="enhance")
```

```php
(new ImageTag('docs/under-exposed.jpg'))
	->effect(Effect::enhance());
```

```java
cloudinary.url().transformation(new Transformation().effect("enhance")).imageTag("docs/under-exposed.jpg");
```

```ruby
cl_image_tag("docs/under-exposed.jpg", effect: "enhance")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("enhance")).BuildImageTag("docs/under-exposed.jpg")
```

```dart
cloudinary.image('docs/under-exposed.jpg').transformation(Transformation()
	.effect(Effect.enhance()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("enhance")).generate("docs/under-exposed.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("enhance")).generate("docs/under-exposed.jpg");
```

```flutter
cloudinary.image('docs/under-exposed.jpg').transformation(Transformation()
	.effect(Effect.enhance()));
```

```kotlin
cloudinary.image {
	publicId("docs/under-exposed.jpg")
	 effect(Effect.enhance()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/under-exposed.jpg", {effect: "enhance"})
```

```react_native
new CloudinaryImage("docs/under-exposed.jpg").effect(enhance());
```

  
  

**Try it out**: [AI image enhancer](https://console.cloudinary.com/app/image/home/ai-image-enhancer?media=image&collection=Underexposed&sample=me%2Funderexposed-1.jpg).

#### Improve

This example shows how the `improve` effect can adjust the overall colors and contrast in an image:

![Improved interior image](https://res.cloudinary.com/demo/image/upload/e_improve/hallway.jpg  "with_image: false")

```nodejs
cloudinary.image("hallway.jpg", {effect: "improve"})
```

```react
new CloudinaryImage("hallway.jpg").adjust(improve());
```

```vue
new CloudinaryImage("hallway.jpg").adjust(improve());
```

```angular
new CloudinaryImage("hallway.jpg").adjust(improve());
```

```js
new CloudinaryImage("hallway.jpg").adjust(improve());
```

```python
CloudinaryImage("hallway.jpg").image(effect="improve")
```

```php
(new ImageTag('hallway.jpg'))
	->adjust(Adjust::improve());
```

```java
cloudinary.url().transformation(new Transformation().effect("improve")).imageTag("hallway.jpg");
```

```ruby
cl_image_tag("hallway.jpg", effect: "improve")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("improve")).BuildImageTag("hallway.jpg")
```

```dart
cloudinary.image('hallway.jpg').transformation(Transformation()
	.adjust(Adjust.improve()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("improve")).generate("hallway.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("improve")).generate("hallway.jpg");
```

```flutter
cloudinary.image('hallway.jpg').transformation(Transformation()
	.adjust(Adjust.improve()));
```

```kotlin
cloudinary.image {
	publicId("hallway.jpg")
	 adjust(Adjust.improve()) 
}.generate()
```

```jquery
$.cloudinary.image("hallway.jpg", {effect: "improve"})
```

```react_native
new CloudinaryImage("hallway.jpg").adjust(improve());
```

  
  

## Advanced syntax examples

In general, most of the visual effects and enhancements can take an additional option to tailor the effect to your liking. For some, however, you may need to provide additional syntax and use some more complex concepts. It is important to understand how these advanced transformations work when attempting to use them. The sections below outline some of the more advanced transformations and help you to use these with your own assets.

Remember, there are many more transformations available and you can find a full list of them, including examples, by checking out our [URL transformation reference](transformation_reference).

> **TIP**: You can use [MediaFlows](https://console.cloudinary.com/mediaflows), Cloudinary’s low-code workflow builder, to automatically generate variants of any image in different colors and styles.

### 3-color-dimension LUTs (3D LUTs)

3-color-dimension lookup tables (known as 3D LUTs) map one color space to another. You can use them to adjust colors, contrast, and/or saturation, so that you can correct contrast, fix a camera's inability to see a particular color shade, or give a final finished look or a particular style to your image. 

After uploading a `.3dl` or `.cube` file as a `raw` file, you can apply it to any image using the `lut` property of the `layer` parameter ( `l_lut:` in URLs), followed by the LUT file name, including the file extension (`.3dl` or `.cube`). 

Below you can see the `docs/textured_handbag.jpg` image file in its original color, compared to the image with different LUT files applied. Below these is the code for applying one of the LUTs.

Original 

with 'iwltbap_sedona' LUT

with 'iwltbap_aspen' LUT

 
![ladybug image with the IWLTBAP sedona LUT applied](https://res.cloudinary.com/demo/image/upload/l_lut:iwltbap_aspen.3dl/docs/textured_handbag.jpg "with_image:false")

```nodejs
cloudinary.image("docs/textured_handbag.jpg", {overlay: "lut:iwltbap_aspen.3dl"})
```

```react
new CloudinaryImage("docs/textured_handbag.jpg").adjust(
  by3dLut("iwltbap_aspen.3dl")
);
```

```vue
new CloudinaryImage("docs/textured_handbag.jpg").adjust(
  by3dLut("iwltbap_aspen.3dl")
);
```

```angular
new CloudinaryImage("docs/textured_handbag.jpg").adjust(
  by3dLut("iwltbap_aspen.3dl")
);
```

```js
new CloudinaryImage("docs/textured_handbag.jpg").adjust(
  by3dLut("iwltbap_aspen.3dl")
);
```

```python
CloudinaryImage("docs/textured_handbag.jpg").image(overlay="lut:iwltbap_aspen.3dl")
```

```php
(new ImageTag('docs/textured_handbag.jpg'))
	->adjust(Adjust::by3dLut("iwltbap_aspen.3dl"));
```

```java
cloudinary.url().transformation(new Transformation().overlay(new Layer().publicId("lut:iwltbap_aspen.3dl"))).imageTag("docs/textured_handbag.jpg");
```

```ruby
cl_image_tag("docs/textured_handbag.jpg", overlay: "lut:iwltbap_aspen.3dl")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Overlay(new Layer().PublicId("lut:iwltbap_aspen.3dl"))).BuildImageTag("docs/textured_handbag.jpg")
```

```dart
cloudinary.image('docs/textured_handbag.jpg').transformation(Transformation()
	.adjust(Adjust.by3dLut("iwltbap_aspen.3dl")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setOverlay("lut:iwltbap_aspen.3dl")).generate("docs/textured_handbag.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().overlay(new Layer().publicId("lut:iwltbap_aspen.3dl"))).generate("docs/textured_handbag.jpg");
```

```flutter
cloudinary.image('docs/textured_handbag.jpg').transformation(Transformation()
	.adjust(Adjust.by3dLut("iwltbap_aspen.3dl")));
```

```kotlin
cloudinary.image {
	publicId("docs/textured_handbag.jpg")
	 adjust(Adjust.by3dLut("iwltbap_aspen.3dl")) 
}.generate()
```

```jquery
$.cloudinary.image("docs/textured_handbag.jpg", {overlay: new cloudinary.Layer().publicId("lut:iwltbap_aspen.3dl")})
```

```react_native
new CloudinaryImage("docs/textured_handbag.jpg").adjust(
  by3dLut("iwltbap_aspen.3dl")
);
```

**See full syntax**: [l_lut](transformation_reference#l_lut) in the _Transformation Reference_.

### Background color
Use the `background` parameter (`b` in URLs) to set the background color of the image. The image background is visible when padding is added with one of the padding crop modes, when rounding corners, when adding overlays, and with semi-transparent PNGs and GIFs.

An opaque color can be set as an RGB hex triplet (e.g., `b_rgb:3e2222`), a 3-digit RGB hex (e.g., `b_rgb:777`) or a named color (e.g., `b_green`). Cloudinary's client libraries also support a `#` shortcut for RGB (e.g., setting `background` to `#3e2222` which is then translated to `rgb:3e2222`).

For example, the uploaded image named `mountain_scene` padded to a width and height of 300 pixels with a light blue background:

![Image padded to a width and height of 300 pixels with green background](https://res.cloudinary.com/demo/image/upload/b_lightblue,c_pad,h_300,w_300/mountain_scene.jpg)

```nodejs
cloudinary.image("mountain_scene.jpg", {background: "lightblue", height: 300, width: 300, crop: "pad"})
```

```react
new CloudinaryImage("mountain_scene.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("lightblue"))
);
```

```vue
new CloudinaryImage("mountain_scene.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("lightblue"))
);
```

```angular
new CloudinaryImage("mountain_scene.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("lightblue"))
);
```

```js
new CloudinaryImage("mountain_scene.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("lightblue"))
);
```

```python
CloudinaryImage("mountain_scene.jpg").image(background="lightblue", height=300, width=300, crop="pad")
```

```php
(new ImageTag('mountain_scene.jpg'))
	->resize(Resize::pad()->width(300)
->height(300)
	->background(
	Background::color(Color::LIGHTBLUE))
	);
```

```java
cloudinary.url().transformation(new Transformation().background("lightblue").height(300).width(300).crop("pad")).imageTag("mountain_scene.jpg");
```

```ruby
cl_image_tag("mountain_scene.jpg", background: "lightblue", height: 300, width: 300, crop: "pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("lightblue").Height(300).Width(300).Crop("pad")).BuildImageTag("mountain_scene.jpg")
```

```dart
cloudinary.image('mountain_scene.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.color(Color.LIGHTBLUE))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("lightblue").setHeight(300).setWidth(300).setCrop("pad")).generate("mountain_scene.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("lightblue").height(300).width(300).crop("pad")).generate("mountain_scene.jpg");
```

```flutter
cloudinary.image('mountain_scene.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.color(Color.LIGHTBLUE))
	));
```

```kotlin
cloudinary.image {
	publicId("mountain_scene.jpg")
	 resize(Resize.pad() { width(300)
 height(300)
	 background(
	Background.color(Color.LIGHTBLUE))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("mountain_scene.jpg", {background: "lightblue", height: 300, width: 300, crop: "pad"})
```

```react_native
new CloudinaryImage("mountain_scene.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(color("lightblue"))
);
```

You can also use a 4-digit or 8-digit RGBA hex quadruplet for the background color, where the 4th hex value represents the alpha (opacity) value (e.g., `co_rgb:3e222240` results in 25% opacity). 

> **NOTE**: When using the background parameter to set the background color of a text overlay, you can also set the color to `predominant_contrast`. This selects the strongest contrasting color to the predominant color while taking all pixels in the image into account. For example, `l_text:Arial_30:foo,b_predominant_contrast`.

**See full syntax**: [b (background)](transformation_reference#b_background) in the _Transformation Reference_.

**Try it out**: [Background](https://console.cloudinary.com/app/image/home/background?media=image&collection=Non-Transparent&sample=me%2Fbg-1-nature&mode1=non-transparent&mode2=predominant-color&direction=horizontal&color=%23B0BDEE&blur=1000&brightness=0).

#### Content-aware padding

You can automatically set the background color to the most prominent color in the image when applying one of the padding crop modes ([pad](resizing_and_cropping#pad), [lpad](resizing_and_cropping#lpad_limit_pad), [mpad](resizing_and_cropping#mpad_minimum_pad) or [fill_pad](resizing_and_cropping#fill_pad)) by setting the `background` parameter to `auto` (`b_auto` in URLs). The parameter can also accept an additional value as follows:

* `b_auto:border` - selects the predominant color while taking only the image border pixels into account. This is the default option for `b_auto`.
* `b_auto:predominant` - selects the predominant color while taking all pixels in the image into account.
* `b_auto:border_contrast` - selects the strongest contrasting color to the predominant color while taking only the image border pixels into account.
* `b_auto:predominant_contrast` - selects the strongest contrasting color to the predominant color while taking all pixels in the image into account.

b_auto:border 

b_auto:predominant

b_auto:border_contrast

b_auto:predominant_contrast

For example, padding the `purple-suit-hanky-tablet` image to a width and height of 300 pixels, and with the background color set to the predominant color in the image:

![Pad to 300x300 with the predominant color set as the background color](https://res.cloudinary.com/demo/image/upload/b_auto:predominant,c_pad,h_300,w_300/purple-suit-hanky-tablet.jpg)

```nodejs
cloudinary.image("purple-suit-hanky-tablet.jpg", {background: "auto:predominant", height: 300, width: 300, crop: "pad"})
```

```react
new CloudinaryImage("purple-suit-hanky-tablet.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(predominant())
);
```

```vue
new CloudinaryImage("purple-suit-hanky-tablet.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(predominant())
);
```

```angular
new CloudinaryImage("purple-suit-hanky-tablet.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(predominant())
);
```

```js
new CloudinaryImage("purple-suit-hanky-tablet.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(predominant())
);
```

```python
CloudinaryImage("purple-suit-hanky-tablet.jpg").image(background="auto:predominant", height=300, width=300, crop="pad")
```

```php
(new ImageTag('purple-suit-hanky-tablet.jpg'))
	->resize(Resize::pad()->width(300)
->height(300)
	->background(
	Background::predominant())
	);
```

```java
cloudinary.url().transformation(new Transformation().background("auto:predominant").height(300).width(300).crop("pad")).imageTag("purple-suit-hanky-tablet.jpg");
```

```ruby
cl_image_tag("purple-suit-hanky-tablet.jpg", background: "auto:predominant", height: 300, width: 300, crop: "pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("auto:predominant").Height(300).Width(300).Crop("pad")).BuildImageTag("purple-suit-hanky-tablet.jpg")
```

```dart
cloudinary.image('purple-suit-hanky-tablet.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominant())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("auto:predominant").setHeight(300).setWidth(300).setCrop("pad")).generate("purple-suit-hanky-tablet.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("auto:predominant").height(300).width(300).crop("pad")).generate("purple-suit-hanky-tablet.jpg");
```

```flutter
cloudinary.image('purple-suit-hanky-tablet.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominant())
	));
```

```kotlin
cloudinary.image {
	publicId("purple-suit-hanky-tablet.jpg")
	 resize(Resize.pad() { width(300)
 height(300)
	 background(
	Background.predominant())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("purple-suit-hanky-tablet.jpg", {background: "auto:predominant", height: 300, width: 300, crop: "pad"})
```

```react_native
new CloudinaryImage("purple-suit-hanky-tablet.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(predominant())
);
```

> **TIP**: To use generative AI to extend the image into the padded areas, see [generative fill](generative_ai_transformations#generative_fill).

**See full syntax**: [b_auto](transformation_reference#b_auto) in the _Transformation Reference_.

**Try it out**: [Background](https://console.cloudinary.com/app/image/home/background?media=image&collection=Non-Transparent&sample=me%2Fbg-1-nature&mode1=non-transparent&mode2=predominant-color&direction=horizontal&color=%23B0BDEE&blur=1000&brightness=0).

##### Gradient fade

You can also apply a padding **gradient fade** effect with the predominant colors in the image by adjusting the value of the `b_auto` parameter as follows:

`b_auto:[gradient_type]:[number]:[direction]`

**Where**:

* `gradient_type` - one of the following values:
  * `predominant_gradient` - base the gradient fade effect on the predominant colors in the image
  * `predominant_gradient_contrast` - base the effect on the colors that contrast the predominant colors in the image
  * `border_gradient` - base the gradient fade effect on the predominant colors in the border pixels of the image
  * `border_gradient_contrast` - base the effect on the colors that contrast the predominant colors in the border pixels of the image
* `number` - the number of predominant colors to select. Possible values: `2` or `4`. Default: `2`
* `direction` - if 2 colors are selected, this parameter specifies the direction to blend the 2 colors together (if 4 colors are selected each gets interpolated between the four corners). Possible values: `horizontal`, `vertical`, `diagonal_desc`, and `diagonal_asc`. Default: `horizontal`

predominant_gradient:2:diagonal_desc

predominant_gradient_contrast:4

![pred grad](https://res.cloudinary.com/demo/image/upload/h_300,w_300,c_pad,b_auto:predominant_gradient:2:diagonal_desc/string.jpg "with_image: false")

```nodejs
cloudinary.image("string.jpg", {height: 300, width: 300, background: "auto:predominant_gradient:2:diagonal_desc", crop: "pad"})
```

```react
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientDirection("diagonal_desc")
        .gradientColors(2)
    )
);
```

```vue
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientDirection("diagonal_desc")
        .gradientColors(2)
    )
);
```

```angular
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientDirection("diagonal_desc")
        .gradientColors(2)
    )
);
```

```js
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientDirection("diagonal_desc")
        .gradientColors(2)
    )
);
```

```python
CloudinaryImage("string.jpg").image(height=300, width=300, background="auto:predominant_gradient:2:diagonal_desc", crop="pad")
```

```php
(new ImageTag('string.jpg'))
	->resize(Resize::pad()->width(300)
->height(300)
	->background(
	Background::predominantGradient()
	->gradientDirection(
	GradientDirection::diagonalDesc())
->gradientColors(2))
	);
```

```java
cloudinary.url().transformation(new Transformation().height(300).width(300).background("auto:predominant_gradient:2:diagonal_desc").crop("pad")).imageTag("string.jpg");
```

```ruby
cl_image_tag("string.jpg", height: 300, width: 300, background: "auto:predominant_gradient:2:diagonal_desc", crop: "pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Height(300).Width(300).Background("auto:predominant_gradient:2:diagonal_desc").Crop("pad")).BuildImageTag("string.jpg")
```

```dart
cloudinary.image('string.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominantGradient()
	.gradientDirection(
	GradientDirection.diagonalDesc())
.gradientColors(2))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setHeight(300).setWidth(300).setBackground("auto:predominant_gradient:2:diagonal_desc").setCrop("pad")).generate("string.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().height(300).width(300).background("auto:predominant_gradient:2:diagonal_desc").crop("pad")).generate("string.jpg");
```

```flutter
cloudinary.image('string.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominantGradient()
	.gradientDirection(
	GradientDirection.diagonalDesc())
.gradientColors(2))
	));
```

```kotlin
cloudinary.image {
	publicId("string.jpg")
	 resize(Resize.pad() { width(300)
 height(300)
	 background(
	Background.predominantGradient() {
	 gradientDirection(
	GradientDirection.diagonalDesc())
 gradientColors(2) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("string.jpg", {height: 300, width: 300, background: "auto:predominant_gradient:2:diagonal_desc", crop: "pad"})
```

```react_native
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientDirection("diagonal_desc")
        .gradientColors(2)
    )
);
```

##### Custom color palette

Add a custom palette to limit the selected color to one of the colors in the palette that you provide. Once the predominant color has been calculated then the closest color from the available palette is selected. Append a colon and then the value `palette` followed by a list of colors, each separated by an underscore. For example, to automatically add padding and a palette that limits the possible choices to green, red and blue:  `b_auto:palette_red_green_blue`

The palette can be used in combination with any of the various values for `b_auto`, and the same color in the palette can be selected more than once when requesting multiple predominant colors. For example, padding to a width and height of 300 pixels, with a 4 color gradient fade in the auto colored padding, and limiting the possible colors to red, green, blue, and orange:

![Pad to 300x300 with 4 color gradient fade from given palette](https://res.cloudinary.com/demo/image/upload/b_auto:predominant_gradient:4:palette_red_green_blue_orange,c_pad,h_300,w_300/string.jpg)

```nodejs
cloudinary.image("string.jpg", {background: "auto:predominant_gradient:4:palette_red_green_blue_orange", height: 300, width: 300, crop: "pad"})
```

```react
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientColors(4)
        .palette("red", "green", "blue", "orange")
    )
);
```

```vue
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientColors(4)
        .palette("red", "green", "blue", "orange")
    )
);
```

```angular
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientColors(4)
        .palette("red", "green", "blue", "orange")
    )
);
```

```js
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientColors(4)
        .palette("red", "green", "blue", "orange")
    )
);
```

```python
CloudinaryImage("string.jpg").image(background="auto:predominant_gradient:4:palette_red_green_blue_orange", height=300, width=300, crop="pad")
```

```php
(new ImageTag('string.jpg'))
	->resize(Resize::pad()->width(300)
->height(300)
	->background(
	Background::predominantGradient()->gradientColors(4)
	->palette(Color::RED,Color::GREEN,Color::BLUE,Color::ORANGE)
	)
	);
```

```java
cloudinary.url().transformation(new Transformation().background("auto:predominant_gradient:4:palette_red_green_blue_orange").height(300).width(300).crop("pad")).imageTag("string.jpg");
```

```ruby
cl_image_tag("string.jpg", background: "auto:predominant_gradient:4:palette_red_green_blue_orange", height: 300, width: 300, crop: "pad")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Background("auto:predominant_gradient:4:palette_red_green_blue_orange").Height(300).Width(300).Crop("pad")).BuildImageTag("string.jpg")
```

```dart
cloudinary.image('string.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominantGradient().gradientColors(4)
	.palette(Color.RED,Color.GREEN,Color.BLUE,Color.ORANGE)
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBackground("auto:predominant_gradient:4:palette_red_green_blue_orange").setHeight(300).setWidth(300).setCrop("pad")).generate("string.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().background("auto:predominant_gradient:4:palette_red_green_blue_orange").height(300).width(300).crop("pad")).generate("string.jpg");
```

```flutter
cloudinary.image('string.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominantGradient().gradientColors(4)
	.palette(Color.RED,Color.GREEN,Color.BLUE,Color.ORANGE)
	)
	));
```

```kotlin
cloudinary.image {
	publicId("string.jpg")
	 resize(Resize.pad() { width(300)
 height(300)
	 background(
	Background.predominantGradient() { gradientColors(4)
	 palette(Color.RED,Color.GREEN,Color.BLUE,Color.ORANGE)
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("string.jpg", {background: "auto:predominant_gradient:4:palette_red_green_blue_orange", height: 300, width: 300, crop: "pad"})
```

```react_native
new CloudinaryImage("string.jpg").resize(
  pad()
    .width(300)
    .height(300)
    .background(
      predominantGradient()
        .gradientColors(4)
        .palette("red", "green", "blue", "orange")
    )
);
```

##### Gradient fade into padding

Fade the image into the added padding by adding the `gradient_fade` effect with a value of `symmetric_pad` (`e_gradient_fade:symmetric_pad` in URLs). The padding blends into the edge of the image with a strength indicated by an additional value, separated by a colon (Range: 0 to 100, Default: 20). Values for x and y can also be specified as a percentage (range: 0.0 to 1.0), or in pixels (integer values) to indicate how far into the image to apply the gradient effect. By default, the gradient is applied 30% into the image (x_0.3). 

For example, padding the `string` image to a width and height of 300 pixels, with the background color set to the predominant color, and with a gradient fade effect, between the added padding and 50% into the image.

![Pad to 300x300 with the predominant color set as the background color and gradient fade into padding](https://res.cloudinary.com/demo/image/upload/b_auto:predominant,c_pad,h_300,w_300/e_gradient_fade:symmetric_pad,x_0.5/string.jpg)

```nodejs
cloudinary.image("string.jpg", {transformation: [
  {background: "auto:predominant", height: 300, width: 300, crop: "pad"},
  {effect: "gradient_fade:symmetric_pad", x: "0.5"}
  ]})
```

```react
new CloudinaryImage("string.jpg")
  .resize(
    pad()
      .width(300)
      .height(300)
      .background(predominant())
  )
  .effect(
    gradientFade()
      .type(symmetricPad())
      .horizontalStartPoint(0.5)
  );
```

```vue
new CloudinaryImage("string.jpg")
  .resize(
    pad()
      .width(300)
      .height(300)
      .background(predominant())
  )
  .effect(
    gradientFade()
      .type(symmetricPad())
      .horizontalStartPoint(0.5)
  );
```

```angular
new CloudinaryImage("string.jpg")
  .resize(
    pad()
      .width(300)
      .height(300)
      .background(predominant())
  )
  .effect(
    gradientFade()
      .type(symmetricPad())
      .horizontalStartPoint(0.5)
  );
```

```js
new CloudinaryImage("string.jpg")
  .resize(
    pad()
      .width(300)
      .height(300)
      .background(predominant())
  )
  .effect(
    gradientFade()
      .type(symmetricPad())
      .horizontalStartPoint(0.5)
  );
```

```python
CloudinaryImage("string.jpg").image(transformation=[
  {'background': "auto:predominant", 'height': 300, 'width': 300, 'crop': "pad"},
  {'effect': "gradient_fade:symmetric_pad", 'x': "0.5"}
  ])
```

```php
(new ImageTag('string.jpg'))
	->resize(Resize::pad()->width(300)
->height(300)
	->background(
	Background::predominant())
	)
	->effect(Effect::gradientFade()
	->type(
	GradientFade::symmetricPad())
->horizontalStartPoint(0.5));
```

```java
cloudinary.url().transformation(new Transformation()
  .background("auto:predominant").height(300).width(300).crop("pad").chain()
  .effect("gradient_fade:symmetric_pad").x(0.5)).imageTag("string.jpg");
```

```ruby
cl_image_tag("string.jpg", transformation: [
  {background: "auto:predominant", height: 300, width: 300, crop: "pad"},
  {effect: "gradient_fade:symmetric_pad", x: 0.5}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Background("auto:predominant").Height(300).Width(300).Crop("pad").Chain()
  .Effect("gradient_fade:symmetric_pad").X(0.5)).BuildImageTag("string.jpg")
```

```dart
cloudinary.image('string.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominant())
	)
	.effect(Effect.gradientFade()
	.type(
	GradientFade.symmetricPad())
.horizontalStartPoint(0.5)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setBackground("auto:predominant").setHeight(300).setWidth(300).setCrop("pad").chain()
  .setEffect("gradient_fade:symmetric_pad").setX(0.5)).generate("string.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .background("auto:predominant").height(300).width(300).crop("pad").chain()
  .effect("gradient_fade:symmetric_pad").x(0.5)).generate("string.jpg");
```

```flutter
cloudinary.image('string.jpg').transformation(Transformation()
	.resize(Resize.pad().width(300)
.height(300)
	.background(
	Background.predominant())
	)
	.effect(Effect.gradientFade()
	.type(
	GradientFade.symmetricPad())
.horizontalStartPoint(0.5)));
```

```kotlin
cloudinary.image {
	publicId("string.jpg")
	 resize(Resize.pad() { width(300)
 height(300)
	 background(
	Background.predominant())
	 })
	 effect(Effect.gradientFade() {
	 type(
	GradientFade.symmetricPad())
 horizontalStartPoint(0.5F) }) 
}.generate()
```

```jquery
$.cloudinary.image("string.jpg", {transformation: [
  {background: "auto:predominant", height: 300, width: 300, crop: "pad"},
  {effect: "gradient_fade:symmetric_pad", x: "0.5"}
  ]})
```

```react_native
new CloudinaryImage("string.jpg")
  .resize(
    pad()
      .width(300)
      .height(300)
      .background(predominant())
  )
  .effect(
    gradientFade()
      .type(symmetricPad())
      .horizontalStartPoint(0.5)
  );
```

**See full syntax**: [e_gradient_fade](transformation_reference#e_gradient_fade) in the _Transformation Reference_.

**Try it out**: [Background](https://console.cloudinary.com/app/image/home/background?media=image&collection=Non-Transparent&sample=me%2Fbg-1-nature&mode1=non-transparent&mode2=predominant-color&direction=horizontal&color=%23B0BDEE&blur=1000&brightness=0).

### Borders

Add a solid border around images with the `border` parameter (`bo` in URLs). The parameter accepts a value with a CSS-like format: `width_style_color` (e.g., `3px_solid_black`). 

An opaque color can be set as an RGB hex triplet (e.g., `rgb:3e2222`), a 3-digit RGB hex (e.g., `rgb:777`) or a named color (e.g., `green`). 

You can also use a 4-digit or 8-digit RGBA hex quadruplet for the color, where the 4th hex value represents the alpha (opacity) value (e.g., `co_rgb:3e222240` results in 25% opacity). 

Additionally, Cloudinary's client libraries also support a `#` shortcut for RGB (e.g., setting color to `#3e2222` which is then translated to `rgb:3e2222`), and when using Cloudinary's client libraries, you can optionally set the border values programmatically instead of as a single string (e.g., `border: { width: 4, color: 'black' }`).

> **NOTE**: Currently only the 'solid' border style is supported.

For example, the uploaded JPG image named blue_sweater delivered with a 5 pixel blue border:

![Image delivered with 5 pixel blue border](https://res.cloudinary.com/demo/image/upload/bo_5px_solid_blue/docs/blue_sweater.jpg "thumb: w_300")

```nodejs
cloudinary.image("docs/blue_sweater.jpg", {border: "5px_solid_blue"})
```

```react
new CloudinaryImage("docs/blue_sweater.jpg").border(solid(5, "blue"));
```

```vue
new CloudinaryImage("docs/blue_sweater.jpg").border(solid(5, "blue"));
```

```angular
new CloudinaryImage("docs/blue_sweater.jpg").border(solid(5, "blue"));
```

```js
new CloudinaryImage("docs/blue_sweater.jpg").border(solid(5, "blue"));
```

```python
CloudinaryImage("docs/blue_sweater.jpg").image(border="5px_solid_blue")
```

```php
(new ImageTag('docs/blue_sweater.jpg'))
	->border(Border::solid(5,Color::BLUE));
```

```java
cloudinary.url().transformation(new Transformation().border("5px_solid_blue")).imageTag("docs/blue_sweater.jpg");
```

```ruby
cl_image_tag("docs/blue_sweater.jpg", border: "5px_solid_blue")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Border("5px_solid_blue")).BuildImageTag("docs/blue_sweater.jpg")
```

```dart
cloudinary.image('docs/blue_sweater.jpg').transformation(Transformation()
	.border(Border.solid(5,Color.BLUE)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setBorder("5px_solid_blue")).generate("docs/blue_sweater.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().border("5px_solid_blue")).generate("docs/blue_sweater.jpg");
```

```flutter
cloudinary.image('docs/blue_sweater.jpg').transformation(Transformation()
	.border(Border.solid(5,Color.BLUE)));
```

```kotlin
cloudinary.image {
	publicId("docs/blue_sweater.jpg")
	 border(Border.solid(5,Color.BLUE)) 
}.generate()
```

```jquery
$.cloudinary.image("docs/blue_sweater.jpg", {border: "5px_solid_blue"})
```

```react_native
new CloudinaryImage("docs/blue_sweater.jpg").border(solid(5, "blue"));
```
![Video delivered with 5 pixel blue border](https://res.cloudinary.com/demo/video/upload/bo_5px_solid_blue/docs/sunglasses.mp4 "thumb: w_500")

```nodejs
cloudinary.video("docs/sunglasses", {border: "5px_solid_blue"})
```

```react
new CloudinaryVideo("docs/sunglasses.mp4").border(solid(5, "blue"));
```

```vue
new CloudinaryVideo("docs/sunglasses.mp4").border(solid(5, "blue"));
```

```angular
new CloudinaryVideo("docs/sunglasses.mp4").border(solid(5, "blue"));
```

```js
new CloudinaryVideo("docs/sunglasses.mp4").border(solid(5, "blue"));
```

```python
CloudinaryVideo("docs/sunglasses").video(border="5px_solid_blue")
```

```php
(new VideoTag('docs/sunglasses.mp4'))
	->border(Border::solid(5,Color::BLUE));
```

```java
cloudinary.url().transformation(new Transformation().border("5px_solid_blue")).videoTag("docs/sunglasses");
```

```ruby
cl_video_tag("docs/sunglasses", border: "5px_solid_blue")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Border("5px_solid_blue")).BuildVideoTag("docs/sunglasses")
```

```dart
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.border(Border.solid(5,Color.BLUE)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setBorder("5px_solid_blue")).generate("docs/sunglasses.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().border("5px_solid_blue")).resourceType("video").generate("docs/sunglasses.mp4");
```

```flutter
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.border(Border.solid(5,Color.BLUE)));
```

```kotlin
cloudinary.video {
	publicId("docs/sunglasses.mp4")
	 border(Border.solid(5,Color.BLUE)) 
}.generate()
```

```jquery
$.cloudinary.video("docs/sunglasses", {border: "5px_solid_blue"})
```

```react_native
new CloudinaryVideo("docs/sunglasses.mp4").border(solid(5, "blue"));
```

Borders are also useful for adding to overlays to clearly define the overlaying image, and also automatically adapt to any rounded corner transformations. For example, the base image given rounded corners with a 10 pixel grey border, and an overlay of the image of `sale` resized to a 100x100 thumbnail added to the northeast corner:

![Base image with rounded corners + overlay](https://res.cloudinary.com/demo/image/upload/c_scale,w_400/bo_10px_solid_grey,r_75/l_sale/c_thumb,w_100,h_100/fl_layer_apply,g_north_east,y_15,x_15/docs/rugged_shoes.jpg)

```nodejs
cloudinary.image("docs/rugged_shoes.jpg", {transformation: [
  {width: 400, crop: "scale"},
  {border: "10px_solid_grey", radius: 75},
  {overlay: "sale"},
  {width: 100, height: 100, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_east", y: 15, x: 15}
  ]})
```

```react
new CloudinaryImage("docs/rugged_shoes.jpg")
  .resize(scale().width(400))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  );
```

```vue
new CloudinaryImage("docs/rugged_shoes.jpg")
  .resize(scale().width(400))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  );
```

```angular
new CloudinaryImage("docs/rugged_shoes.jpg")
  .resize(scale().width(400))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  );
```

```js
new CloudinaryImage("docs/rugged_shoes.jpg")
  .resize(scale().width(400))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  );
```

```python
CloudinaryImage("docs/rugged_shoes.jpg").image(transformation=[
  {'width': 400, 'crop': "scale"},
  {'border': "10px_solid_grey", 'radius': 75},
  {'overlay': "sale"},
  {'width': 100, 'height': 100, 'crop': "thumb"},
  {'flags': "layer_apply", 'gravity': "north_east", 'y': 15, 'x': 15}
  ])
```

```php
(new ImageTag('docs/rugged_shoes.jpg'))
	->resize(Resize::scale()->width(400))
	->border(Border::solid(10,Color::GREY)
	->roundCorners(
	RoundCorners::byRadius(75))
	)
	->overlay(Overlay::source(
	Source::image("sale")
	->transformation((new Transformation())
	->resize(Resize::thumbnail()->width(100)
->height(100)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
->offsetX(15)
->offsetY(15))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(400).crop("scale").chain()
  .border("10px_solid_grey").radius(75).chain()
  .overlay(new Layer().publicId("sale")).chain()
  .width(100).height(100).crop("thumb").chain()
  .flags("layer_apply").gravity("north_east").y(15).x(15)).imageTag("docs/rugged_shoes.jpg");
```

```ruby
cl_image_tag("docs/rugged_shoes.jpg", transformation: [
  {width: 400, crop: "scale"},
  {border: "10px_solid_grey", radius: 75},
  {overlay: "sale"},
  {width: 100, height: 100, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_east", y: 15, x: 15}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(400).Crop("scale").Chain()
  .Border("10px_solid_grey").Radius(75).Chain()
  .Overlay(new Layer().PublicId("sale")).Chain()
  .Width(100).Height(100).Crop("thumb").Chain()
  .Flags("layer_apply").Gravity("north_east").Y(15).X(15)).BuildImageTag("docs/rugged_shoes.jpg")
```

```dart
cloudinary.image('docs/rugged_shoes.jpg').transformation(Transformation()
	.resize(Resize.scale().width(400))
	.border(Border.solid(10,Color.GREY)
	.roundCorners(
	RoundCorners.byRadius(75))
	)
	.overlay(Overlay.source(
	Source.image("sale")
	.transformation(new Transformation()
	.resize(Resize.thumbnail().width(100)
.height(100)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
.offsetX(15)
.offsetY(15))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(400).setCrop("scale").chain()
  .setBorder("10px_solid_grey").setRadius(75).chain()
  .setOverlay("sale").chain()
  .setWidth(100).setHeight(100).setCrop("thumb").chain()
  .setFlags("layer_apply").setGravity("north_east").setY(15).setX(15)).generate("docs/rugged_shoes.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(400).crop("scale").chain()
  .border("10px_solid_grey").radius(75).chain()
  .overlay(new Layer().publicId("sale")).chain()
  .width(100).height(100).crop("thumb").chain()
  .flags("layer_apply").gravity("north_east").y(15).x(15)).generate("docs/rugged_shoes.jpg");
```

```flutter
cloudinary.image('docs/rugged_shoes.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_400/bo_10px_solid_grey,r_75/l_sale/c_thumb,w_100,h_100/fl_layer_apply,g_north_east,y_15,x_15"));
```

```kotlin
cloudinary.image {
	publicId("docs/rugged_shoes.jpg")
	 resize(Resize.scale() { width(400) })
	 border(Border.solid(10,Color.GREY) {
	 roundCorners(
	RoundCorners.byRadius(75))
	 })
	 overlay(Overlay.source(
	Source.image("sale") {
	 transformation(Transformation {
	 resize(Resize.thumbnail() { width(100)
 height(100) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
 offsetX(15)
 offsetY(15) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/rugged_shoes.jpg", {transformation: [
  {width: 400, crop: "scale"},
  {border: "10px_solid_grey", radius: 75},
  {overlay: new cloudinary.Layer().publicId("sale")},
  {width: 100, height: 100, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_east", y: 15, x: 15}
  ]})
```

```react_native
new CloudinaryImage("docs/rugged_shoes.jpg")
  .resize(scale().width(400))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  );
```
![Base video with rounded corners + overlay](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/bo_10px_solid_grey,r_75/l_sale/c_thumb,w_100,h_100/fl_layer_apply,g_north_east,y_15,x_15/v1664993417/pm/gallery/sunglasses.mp4)

```nodejs
cloudinary.video("pm/gallery/sunglasses", {transformation: [
  {width: 500, crop: "scale"},
  {border: "10px_solid_grey", radius: 75},
  {overlay: "sale"},
  {width: 100, height: 100, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_east", y: 15, x: 15}
  ]})
```

```react
new CloudinaryVideo("pm/gallery/sunglasses.mp4")
  .resize(scale().width(500))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  )
  .setVersion(1664993417);
```

```vue
new CloudinaryVideo("pm/gallery/sunglasses.mp4")
  .resize(scale().width(500))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  )
  .setVersion(1664993417);
```

```angular
new CloudinaryVideo("pm/gallery/sunglasses.mp4")
  .resize(scale().width(500))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  )
  .setVersion(1664993417);
```

```js
new CloudinaryVideo("pm/gallery/sunglasses.mp4")
  .resize(scale().width(500))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  )
  .setVersion(1664993417);
```

```python
CloudinaryVideo("pm/gallery/sunglasses").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'border': "10px_solid_grey", 'radius': 75},
  {'overlay': "sale"},
  {'width': 100, 'height': 100, 'crop': "thumb"},
  {'flags': "layer_apply", 'gravity': "north_east", 'y': 15, 'x': 15}
  ])
```

```php
(new VideoTag('pm/gallery/sunglasses.mp4'))
	->resize(Resize::scale()->width(500))
	->border(Border::solid(10,Color::GREY)
	->roundCorners(
	RoundCorners::byRadius(75))
	)
	->overlay(Overlay::source(
	Source::image("sale")
	->transformation((new Transformation())
	->resize(Resize::thumbnail()->width(100)
->height(100)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
->offsetX(15)
->offsetY(15))
	)
	->version(1664993417);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .border("10px_solid_grey").radius(75).chain()
  .overlay(new Layer().publicId("sale")).chain()
  .width(100).height(100).crop("thumb").chain()
  .flags("layer_apply").gravity("north_east").y(15).x(15)).videoTag("pm/gallery/sunglasses");
```

```ruby
cl_video_tag("pm/gallery/sunglasses", transformation: [
  {width: 500, crop: "scale"},
  {border: "10px_solid_grey", radius: 75},
  {overlay: "sale"},
  {width: 100, height: 100, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_east", y: 15, x: 15}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Border("10px_solid_grey").Radius(75).Chain()
  .Overlay(new Layer().PublicId("sale")).Chain()
  .Width(100).Height(100).Crop("thumb").Chain()
  .Flags("layer_apply").Gravity("north_east").Y(15).X(15)).BuildVideoTag("pm/gallery/sunglasses")
```

```dart
cloudinary.video('pm/gallery/sunglasses.mp4').transformation(Transformation()
	.resize(Resize.scale().width(500))
	.border(Border.solid(10,Color.GREY)
	.roundCorners(
	RoundCorners.byRadius(75))
	)
	.overlay(Overlay.source(
	Source.image("sale")
	.transformation(new Transformation()
	.resize(Resize.thumbnail().width(100)
.height(100)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
.offsetX(15)
.offsetY(15))
	)
	.version(1664993417));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setBorder("10px_solid_grey").setRadius(75).chain()
  .setOverlay("sale").chain()
  .setWidth(100).setHeight(100).setCrop("thumb").chain()
  .setFlags("layer_apply").setGravity("north_east").setY(15).setX(15)).generate("pm/gallery/sunglasses.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .border("10px_solid_grey").radius(75).chain()
  .overlay(new Layer().publicId("sale")).chain()
  .width(100).height(100).crop("thumb").chain()
  .flags("layer_apply").gravity("north_east").y(15).x(15)).resourceType("video").generate("pm/gallery/sunglasses.mp4");
```

```flutter
cloudinary.video('pm/gallery/sunglasses.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/bo_10px_solid_grey,r_75/l_sale/c_thumb,w_100,h_100/fl_layer_apply,g_north_east,y_15,x_15")
	.version(1664993417));
```

```kotlin
cloudinary.video {
	publicId("pm/gallery/sunglasses.mp4")
	 resize(Resize.scale() { width(500) })
	 border(Border.solid(10,Color.GREY) {
	 roundCorners(
	RoundCorners.byRadius(75))
	 })
	 overlay(Overlay.source(
	Source.image("sale") {
	 transformation(Transformation {
	 resize(Resize.thumbnail() { width(100)
 height(100) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
 offsetX(15)
 offsetY(15) })
	 })
	 version(1664993417) 
}.generate()
```

```jquery
$.cloudinary.video("pm/gallery/sunglasses", {transformation: [
  {width: 500, crop: "scale"},
  {border: "10px_solid_grey", radius: 75},
  {overlay: new cloudinary.Layer().publicId("sale")},
  {width: 100, height: 100, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_east", y: 15, x: 15}
  ]})
```

```react_native
new CloudinaryVideo("pm/gallery/sunglasses.mp4")
  .resize(scale().width(500))
  .border(solid(10, "grey").roundCorners(byRadius(75)))
  .overlay(
    source(
      image("sale").transformation(
        new Transformation().resize(thumbnail().width(100).height(100))
      )
    ).position(
      new Position()
        .gravity(compass("north_east"))
        .offsetX(15)
        .offsetY(15)
    )
  )
  .setVersion(1664993417);
```
> **NOTE**: When using the border parameter to set the border color of a text overlay, you can also set the color to `predominant_contrast`. This selects the strongest contrasting color to the predominant color while taking all pixels in the image into account. For example, `l_text:Arial_30:foo,bo_3px_solid_predominant_contrast`

**See full syntax**: [bo (border)](transformation_reference#bo_border) in the _Transformation Reference_.

### Color blind effects
Cloudinary has a number of features that can help you to choose the best images as well as to transform problematic images to ones that are more accessible to color blind people. You can use Cloudinary to:

* [Simulate](#simulate_color_blind_conditions) how an image would look to people with different color blind conditions.
* [Assist](#assist_people_with_color_blind_conditions) people with color blind conditions to help differentiate problematic colors.
* [Analyze images](accessibility_analysis) to provide color blind accessibility scores and information on which colors are the hardest to differentiate.

> **TIP**: Watch a video tutorial that addresses [color accessibility in JavaScript](color_accessibility_tutorial).

#### Simulate color blind conditions

You can simulate a number of different color blind conditions using the `simulate_colorblind` effect. For full syntax and supported conditions, see the [e\_simulate\_colorblind](transformation_reference#e_simulate_colorblind) parameter in the Transformation URL API Reference.

Simulate the way an image would appear to someone with **deuteranopia** (most common form of) color blindness:

![Simulate deuteranopia color blindness condition](https://res.cloudinary.com/demo/image/upload/e_simulate_colorblind:deuteranopia/docs/snooker.jpg "with_image: false")

```nodejs
cloudinary.image("docs/snooker.jpg", {effect: "simulate_colorblind:deuteranopia"})
```

```react
new CloudinaryImage("docs/snooker.jpg").effect(
  simulateColorBlind().condition("deuteranopia")
);
```

```vue
new CloudinaryImage("docs/snooker.jpg").effect(
  simulateColorBlind().condition("deuteranopia")
);
```

```angular
new CloudinaryImage("docs/snooker.jpg").effect(
  simulateColorBlind().condition("deuteranopia")
);
```

```js
new CloudinaryImage("docs/snooker.jpg").effect(
  simulateColorBlind().condition("deuteranopia")
);
```

```python
CloudinaryImage("docs/snooker.jpg").image(effect="simulate_colorblind:deuteranopia")
```

```php
(new ImageTag('docs/snooker.jpg'))
	->effect(Effect::simulateColorBlind()
	->condition(
	SimulateColorBlind::deuteranopia())
	);
```

```java
cloudinary.url().transformation(new Transformation().effect("simulate_colorblind:deuteranopia")).imageTag("docs/snooker.jpg");
```

```ruby
cl_image_tag("docs/snooker.jpg", effect: "simulate_colorblind:deuteranopia")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("simulate_colorblind:deuteranopia")).BuildImageTag("docs/snooker.jpg")
```

```dart
cloudinary.image('docs/snooker.jpg').transformation(Transformation()
	.effect(Effect.simulateColorBlind()
	.condition(
	SimulateColorBlind.deuteranopia())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("simulate_colorblind:deuteranopia")).generate("docs/snooker.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("simulate_colorblind:deuteranopia")).generate("docs/snooker.jpg");
```

```flutter
cloudinary.image('docs/snooker.jpg').transformation(Transformation()
	.effect(Effect.simulateColorBlind()
	.condition(
	SimulateColorBlind.deuteranopia())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/snooker.jpg")
	 effect(Effect.simulateColorBlind() {
	 condition(
	SimulateColorBlind.deuteranopia())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/snooker.jpg", {effect: "simulate_colorblind:deuteranopia"})
```

```react_native
new CloudinaryImage("docs/snooker.jpg").effect(
  simulateColorBlind().condition("deuteranopia")
);
```

Original image

Deuteranopia simulation

**See full syntax**: [e_simulate_colorblind](transformation_reference#e_simulate_colorblind) in the _Transformation Reference_.

#### Assist people with color blind conditions

Use the `assist_colorblind` effect ([e_assist_colorblind](transformation_reference#e_assist_colorblind) in URLs) to help people with color blind conditions to differentiate between colors. 

You can add stripes in different directions and thicknesses to different colors, making them easier to differentiate, for example:

![Help a color blind user differentiate similar colors with stripes](https://res.cloudinary.com/demo/image/upload/e_assist_colorblind:8/v1585561697/docs/snooker.jpg "thumb: w_600")

```nodejs
cloudinary.image("docs/snooker.jpg", {effect: "assist_colorblind:8"})
```

```react
new CloudinaryImage("docs/snooker.jpg")
  .effect(assistColorBlind().stripesStrength(8))
  .setVersion(1585561697);
```

```vue
new CloudinaryImage("docs/snooker.jpg")
  .effect(assistColorBlind().stripesStrength(8))
  .setVersion(1585561697);
```

```angular
new CloudinaryImage("docs/snooker.jpg")
  .effect(assistColorBlind().stripesStrength(8))
  .setVersion(1585561697);
```

```js
new CloudinaryImage("docs/snooker.jpg")
  .effect(assistColorBlind().stripesStrength(8))
  .setVersion(1585561697);
```

```python
CloudinaryImage("docs/snooker.jpg").image(effect="assist_colorblind:8")
```

```php
(new ImageTag('docs/snooker.jpg'))
	->effect(Effect::assistColorBlind()->stripesStrength(8))
	->version(1585561697);
```

```java
cloudinary.url().transformation(new Transformation().effect("assist_colorblind:8")).imageTag("docs/snooker.jpg");
```

```ruby
cl_image_tag("docs/snooker.jpg", effect: "assist_colorblind:8")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("assist_colorblind:8")).BuildImageTag("docs/snooker.jpg")
```

```dart
cloudinary.image('docs/snooker.jpg').transformation(Transformation()
	.effect(Effect.assistColorBlind().stripesStrength(8))
	.version(1585561697));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("assist_colorblind:8")).generate("docs/snooker.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("assist_colorblind:8")).generate("docs/snooker.jpg");
```

```flutter
cloudinary.image('docs/snooker.jpg').transformation(Transformation()
	.effect(Effect.assistColorBlind().stripesStrength(8))
	.version(1585561697));
```

```kotlin
cloudinary.image {
	publicId("docs/snooker.jpg")
	 effect(Effect.assistColorBlind() { stripesStrength(8) })
	 version(1585561697) 
}.generate()
```

```jquery
$.cloudinary.image("docs/snooker.jpg", {effect: "assist_colorblind:8"})
```

```react_native
new CloudinaryImage("docs/snooker.jpg")
  .effect(assistColorBlind().stripesStrength(8))
  .setVersion(1585561697);
``` 

A color blind person would see the stripes like this: 

![Stripe color-blind assistance with simulation](https://res.cloudinary.com/demo/image/upload/e_assist_colorblind:8/e_simulate_colorblind/docs/snooker.jpg "thumb: w_600, with_code:false, with_url:false") 

Alternatively, you can use color shifts to make colors easier to distinguish by specifying the `xray` assist type, for example:

![Help a colorblind user differentiate similar colors with color shifts](https://res.cloudinary.com/demo/image/upload/e_assist_colorblind:xray/docs/snooker.jpg "thumb: w_600")

```nodejs
cloudinary.image("docs/snooker.jpg", {effect: "assist_colorblind:xray"})
```

```react
new CloudinaryImage("docs/snooker.jpg").effect(assistColorBlind().xray());
```

```vue
new CloudinaryImage("docs/snooker.jpg").effect(assistColorBlind().xray());
```

```angular
new CloudinaryImage("docs/snooker.jpg").effect(assistColorBlind().xray());
```

```js
new CloudinaryImage("docs/snooker.jpg").effect(assistColorBlind().xray());
```

```python
CloudinaryImage("docs/snooker.jpg").image(effect="assist_colorblind:xray")
```

```php
(new ImageTag('docs/snooker.jpg'))
	->effect(Effect::assistColorBlind()->xray());
```

```java
cloudinary.url().transformation(new Transformation().effect("assist_colorblind:xray")).imageTag("docs/snooker.jpg");
```

```ruby
cl_image_tag("docs/snooker.jpg", effect: "assist_colorblind:xray")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("assist_colorblind:xray")).BuildImageTag("docs/snooker.jpg")
```

```dart
cloudinary.image('docs/snooker.jpg').transformation(Transformation()
	.effect(Effect.assistColorBlind().xray()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("assist_colorblind:xray")).generate("docs/snooker.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("assist_colorblind:xray")).generate("docs/snooker.jpg");
```

```flutter
cloudinary.image('docs/snooker.jpg').transformation(Transformation()
	.effect(Effect.assistColorBlind().xray()));
```

```kotlin
cloudinary.image {
	publicId("docs/snooker.jpg")
	 effect(Effect.assistColorBlind() { xray() }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/snooker.jpg", {effect: "assist_colorblind:xray"})
```

```react_native
new CloudinaryImage("docs/snooker.jpg").effect(assistColorBlind().xray());
```

**See full syntax**: [e_assist_colorblind](transformation_reference#e_assist_colorblind) in the _Transformation Reference_.

### Displacement maps

You can displace pixels in a source image based on the intensity of pixels in a displacement map image using the `e_displace` effect in conjunction with a displacement map image specified as an overlay. This can be useful to create interesting effects in a select area of an image or to warp the entire image to fit a needed design or texture. For example, to make an image wrap around a coffee cup or appear to be printed on a textured canvas.

The `displace` effect (`e_displace` in URLs) algorithm displaces the pixels in an image according to the color channels of the pixels in another specified image (a gradient map specified with the overlay parameter). The `displace` effect is added in the same component as the `layer_apply` flag. The red channel controls horizontal displacement, green controls vertical displacement, and the blue channel is ignored. 
> **NOTE**: The same [layer transformation syntax](layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](layers#authenticated_or_private_layers).
The final displacement of each pixel in the base image is determined by a combination of the red and green color channels, together with the configured x and/or y parameters:

x | Red Channel | Pixel Displacement 
---|---|---
Positive | 0 - 127 | Right
Positive | 128 - 255 | Left
Negative | 0 - 127 | Left
Negative | 128 - 255 | Right

y | Green Channel | Pixel Displacement
---|---|---
Positive | 0 - 127 | Down
Positive | 128 - 255 | Up
Negative | 0 - 127 | Up
Negative | 128 - 255 | Down

The displacement of pixels is proportional to the channel values, with the extreme values giving the most displacement, and values closer to 128 giving the least displacement. 

The displacement formulae are:

* `x displacement = (127-red channel)*(x parameter)/127`
* `y displacement = (127-green channel)*(y parameter)/127`

Positive displacement is right and down, and negative displacement is up and left.

For example, specifying an x value of 500, at red channel values of 0 and 255, the base image pixels are displaced by 500 pixels horizontally, whereas at 114 and 141 (127 - 10% and 128 + 10%) the base image pixels are displaced by 50 pixels horizontally.

x | Red Channel | Pixel Displacement
---|---|---
500 | 0 | 500 pixels right
500 | 114 | 50 pixels right
500 | 141 | 50 pixels left
500 | 255 | 500 pixels left
> **NOTE**: Values of `x` and `y` must be between -999 and 999.
This is a standard displacement map algorithm used by popular image editing tools, so you can upload existing displacement maps found on the internet or created by your graphic artists to your product environment and specify them as the overlay asset, enabling you to dynamically apply the displacement effect on other images in your product environment or those uploaded by your end users.

Several sample use case of this layer-based effect are shown in the sections below.

**See full syntax**: [e_displace](transformation_reference#e_displace) in the _Transformation Reference_.

#### Use case: Warp an image to fit a 3-dimensional product

Use a displacement map to warp the perspective of an overlay image for final placement as an overlay on a mug:

![sample with zoom displacement](https://demo-res.cloudinary.com/l_radialize/e_displace,fl_layer_apply,y_-20/docs/couple-cornfield "with_image: false")

Using this overlay transformation for placement on a mug:

![Zoom displacement map](https://demo-res.cloudinary.com/w_500/l_docs:couple-cornfield.png/c_pad,h_250,w_250/l_radialize/e_displace,fl_layer_apply,y_-8/fl_layer_apply,x_10/left_mug "with_url: false, with_code: false, thumb: w_500")

![Zoom displacement map](https://demo-res.cloudinary.com/w_500/l_docs:couple-cornfield.png/c_pad,h_250,w_250/l_radialize/e_displace,fl_layer_apply,y_-8/fl_layer_apply,x_10/left_mug "with_image: false")

#### Use case: Create a zoom effect 

To displace the `sample` image by using a displacement map, creating a zoom effect:

![sample with zoom displacement](https://demo-res.cloudinary.com/l_docs:zoom_map/e_displace,fl_layer_apply,x_150,y_150/docs/hands "with_image: false")

You could take this a step further by applying this displacement along with another overlay component that adds a magnifying glass. In this example, the same displacement map as above is used on a different base image and offset to a different location.

![zoomed in image](http://demo-res.cloudinary.com/c_fill,h_500,w_500/l_woman/w_500,h_500,c_fill/c_crop,h_200,w_200,x_20,y_20/l_docs:zoom_map/c_fill,h_200,w_200/e_displace,fl_layer_apply,x_20,y_20/fl_layer_apply,g_north_west,x_20,y_20/l_mag-glass.png/fl_layer_apply,fl_no_overflow,g_north_west,h_215,w_330,x_38,y_38/woman.jpg "thumb: w_400")

#### Use case: Apply a texture to your image

![sample with zoom displacement](https://res.cloudinary.com/demo/image/upload/w_600/l_docs:old-canvas-texture/e_displace,fl_layer_apply,x_25,y_25/c_crop,w_585,h_320/docs/autumn_woods.jpg "with_image: false")

```nodejs
cloudinary.image("docs/autumn_woods.jpg", {transformation: [
  {width: 600, crop: "scale"},
  {overlay: "docs:old-canvas-texture"},
  {effect: "displace", flags: "layer_apply", x: 25, y: 25},
  {width: 585, height: 320, crop: "crop"}
  ]})
```

```react
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(600))
  .reshape(
    displace(image("docs/old-canvas-texture")).position(
      new Position().offsetX(25).offsetY(25)
    )
  )
  .resize(crop().width(585).height(320));
```

```vue
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(600))
  .reshape(
    displace(image("docs/old-canvas-texture")).position(
      new Position().offsetX(25).offsetY(25)
    )
  )
  .resize(crop().width(585).height(320));
```

```angular
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(600))
  .reshape(
    displace(image("docs/old-canvas-texture")).position(
      new Position().offsetX(25).offsetY(25)
    )
  )
  .resize(crop().width(585).height(320));
```

```js
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(600))
  .reshape(
    displace(image("docs/old-canvas-texture")).position(
      new Position().offsetX(25).offsetY(25)
    )
  )
  .resize(crop().width(585).height(320));
```

```python
CloudinaryImage("docs/autumn_woods.jpg").image(transformation=[
  {'width': 600, 'crop': "scale"},
  {'overlay': "docs:old-canvas-texture"},
  {'effect': "displace", 'flags': "layer_apply", 'x': 25, 'y': 25},
  {'width': 585, 'height': 320, 'crop': "crop"}
  ])
```

```php
(new ImageTag('docs/autumn_woods.jpg'))
	->resize(Resize::scale()->width(600))
	->reshape(Reshape::displace(
	Source::image("docs/old-canvas-texture"))
	->position((new Position())->offsetX(25)
->offsetY(25))
	)
	->resize(Resize::crop()->width(585)
->height(320));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(600).crop("scale").chain()
  .overlay(new Layer().publicId("docs:old-canvas-texture")).chain()
  .effect("displace").flags("layer_apply").x(25).y(25).chain()
  .width(585).height(320).crop("crop")).imageTag("docs/autumn_woods.jpg");
```

```ruby
cl_image_tag("docs/autumn_woods.jpg", transformation: [
  {width: 600, crop: "scale"},
  {overlay: "docs:old-canvas-texture"},
  {effect: "displace", flags: "layer_apply", x: 25, y: 25},
  {width: 585, height: 320, crop: "crop"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(600).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("docs:old-canvas-texture")).Chain()
  .Effect("displace").Flags("layer_apply").X(25).Y(25).Chain()
  .Width(585).Height(320).Crop("crop")).BuildImageTag("docs/autumn_woods.jpg")
```

```dart
cloudinary.image('docs/autumn_woods.jpg').transformation(Transformation()
	.resize(Resize.scale().width(600))
	.reshape(Reshape.displace(
	Source.image("docs/old-canvas-texture"))
	.position(Position().offsetX(25)
.offsetY(25))
	)
	.resize(Resize.crop().width(585)
.height(320)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(600).setCrop("scale").chain()
  .setOverlay("docs:old-canvas-texture").chain()
  .setEffect("displace").setFlags("layer_apply").setX(25).setY(25).chain()
  .setWidth(585).setHeight(320).setCrop("crop")).generate("docs/autumn_woods.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(600).crop("scale").chain()
  .overlay(new Layer().publicId("docs:old-canvas-texture")).chain()
  .effect("displace").flags("layer_apply").x(25).y(25).chain()
  .width(585).height(320).crop("crop")).generate("docs/autumn_woods.jpg");
```

```flutter
cloudinary.image('docs/autumn_woods.jpg').transformation(Transformation()
	.resize(Resize.scale().width(600))
	.reshape(Reshape.displace(
	Source.image("docs/old-canvas-texture"))
	.position(Position().offsetX(25)
.offsetY(25))
	)
	.resize(Resize.crop().width(585)
.height(320)));
```

```kotlin
cloudinary.image {
	publicId("docs/autumn_woods.jpg")
	 resize(Resize.scale() { width(600) })
	 reshape(Reshape.displace(
	Source.image("docs/old-canvas-texture")) {
	 position(Position() { offsetX(25)
 offsetY(25) })
	 })
	 resize(Resize.crop() { width(585)
 height(320) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/autumn_woods.jpg", {transformation: [
  {width: 600, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("docs:old-canvas-texture")},
  {effect: "displace", flags: "layer_apply", x: 25, y: 25},
  {width: 585, height: 320, crop: "crop"}
  ]})
```

```react_native
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(600))
  .reshape(
    displace(image("docs/old-canvas-texture")).position(
      new Position().offsetX(25).offsetY(25)
    )
  )
  .resize(crop().width(585).height(320));
```

##### Interactive texture demo

For more details on displacement mapping with the `displace` effect, see the article on [Displacement Maps for Easy Image Transformations with Cloudinary](/blog/how_to_use_displacement_maps_to_transform_images). The article includes a variety of examples, as well as an interactive demo.

### Distort

Using the `distort` effect, you can change the shape of an image, distorting its dimensions and the image itself. It works in one of two modes: you can either change the positioning of each of the corners, or you can warp the image into an arc.

To change the positioning of each of the corners, it is helpful to have in mind a picture like the one below. The solid rectangle shows the coordinates of the corners of the original image. The intended result of the distortion is represented by the dashed shape. The new corner coordinates are specified in the distort effect as x,y pairs, clockwise from top-left. For example:

![Distortion coordinates](https://res.cloudinary.com/demo/image/upload/dpr_auto/f_auto/b_white/Distort_example "with_code: false, with_url: false")
![Image distorted to new shape](https://res.cloudinary.com/demo/image/upload/c_scale,w_400/e_distort:40:25:280:60:260:155:35:165/docs/wines.jpg)

```nodejs
cloudinary.image("docs/wines.jpg", {transformation: [
  {width: 400, crop: "scale"},
  {effect: "distort:40:25:280:60:260:155:35:165"}
  ]})
```

```react
new CloudinaryImage("docs/wines.jpg")
  .resize(scale().width(400))
  .reshape(distort([40, 25, 280, 60, 260, 155, 35, 165]));
```

```vue
new CloudinaryImage("docs/wines.jpg")
  .resize(scale().width(400))
  .reshape(distort([40, 25, 280, 60, 260, 155, 35, 165]));
```

```angular
new CloudinaryImage("docs/wines.jpg")
  .resize(scale().width(400))
  .reshape(distort([40, 25, 280, 60, 260, 155, 35, 165]));
```

```js
new CloudinaryImage("docs/wines.jpg")
  .resize(scale().width(400))
  .reshape(distort([40, 25, 280, 60, 260, 155, 35, 165]));
```

```python
CloudinaryImage("docs/wines.jpg").image(transformation=[
  {'width': 400, 'crop': "scale"},
  {'effect': "distort:40:25:280:60:260:155:35:165"}
  ])
```

```php
(new ImageTag('docs/wines.jpg'))
	->resize(Resize::scale()->width(400))
	->reshape(Reshape::distort([40, 25, 280, 60, 260, 155, 35, 165]));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(400).crop("scale").chain()
  .effect("distort:40:25:280:60:260:155:35:165")).imageTag("docs/wines.jpg");
```

```ruby
cl_image_tag("docs/wines.jpg", transformation: [
  {width: 400, crop: "scale"},
  {effect: "distort:40:25:280:60:260:155:35:165"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(400).Crop("scale").Chain()
  .Effect("distort:40:25:280:60:260:155:35:165")).BuildImageTag("docs/wines.jpg")
```

```dart
cloudinary.image('docs/wines.jpg').transformation(Transformation()
	.resize(Resize.scale().width(400))
	.reshape(Reshape.distort([40, 25, 280, 60, 260, 155, 35, 165])));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(400).setCrop("scale").chain()
  .setEffect("distort:40:25:280:60:260:155:35:165")).generate("docs/wines.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(400).crop("scale").chain()
  .effect("distort:40:25:280:60:260:155:35:165")).generate("docs/wines.jpg");
```

```flutter
cloudinary.image('docs/wines.jpg').transformation(Transformation()
	.resize(Resize.scale().width(400))
	.reshape(Reshape.distort([40, 25, 280, 60, 260, 155, 35, 165])));
```

```kotlin
cloudinary.image {
	publicId("docs/wines.jpg")
	 resize(Resize.scale() { width(400) })
	 reshape(Reshape.distort(listOf(40, 25, 280, 60, 260, 155, 35, 165))) 
}.generate()
```

```jquery
$.cloudinary.image("docs/wines.jpg", {transformation: [
  {width: 400, crop: "scale"},
  {effect: "distort:40:25:280:60:260:155:35:165"}
  ]})
```

```react_native
new CloudinaryImage("docs/wines.jpg")
  .resize(scale().width(400))
  .reshape(distort([40, 25, 280, 60, 260, 155, 35, 165]));
```
    
For more details on perspective warping with the `distort` effect, see the article on [How to dynamically distort images to fit your graphic design](/blog/how_to_dynamically_distort_images_to_fit_your_graphic_design).

To curve an image, you can specify `arc` and the number of degrees in the distort effect, instead of the corner coordinates. If you specify a positive value for the number of degrees, the image is curved upwards, like a frown. Negative values curve the image downwards, like a smile. 

You can distort text in the same way as images, for example, to add curved text to the `frisbee` image (`e_distort:arc:-120`):

![Curved text distortion](https://res.cloudinary.com/demo/image/upload/co_white,l_text:impact_150:Your%20Brand%20Name%20or%20Logo%20Here/o_60/e_distort:arc:-120.0/fl_layer_apply,g_south,y_840/frisbee.jpg "thumb: w_400")

```nodejs
cloudinary.image("frisbee.jpg", {transformation: [
  {color: "white", overlay: {font_family: "impact", font_size: 150, text: "Your%20Brand%20Name%20or%20Logo%20Here"}},
  {opacity: 60},
  {effect: "distort:arc:-120.0"},
  {flags: "layer_apply", gravity: "south", y: 840}
  ]})
```

```react
new CloudinaryImage("frisbee.jpg").overlay(
  source(
    text("Your Brand Name or Logo Here", new TextStyle("impact", 150))
      .textColor("white")
      .transformation(
        new Transformation().adjust(opacity(60)).reshape(distortArc("-120.0"))
      )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(840)
  )
);
```

```vue
new CloudinaryImage("frisbee.jpg").overlay(
  source(
    text("Your Brand Name or Logo Here", new TextStyle("impact", 150))
      .textColor("white")
      .transformation(
        new Transformation().adjust(opacity(60)).reshape(distortArc("-120.0"))
      )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(840)
  )
);
```

```angular
new CloudinaryImage("frisbee.jpg").overlay(
  source(
    text("Your Brand Name or Logo Here", new TextStyle("impact", 150))
      .textColor("white")
      .transformation(
        new Transformation().adjust(opacity(60)).reshape(distortArc("-120.0"))
      )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(840)
  )
);
```

```js
new CloudinaryImage("frisbee.jpg").overlay(
  source(
    text("Your Brand Name or Logo Here", new TextStyle("impact", 150))
      .textColor("white")
      .transformation(
        new Transformation().adjust(opacity(60)).reshape(distortArc("-120.0"))
      )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(840)
  )
);
```

```python
CloudinaryImage("frisbee.jpg").image(transformation=[
  {'color': "white", 'overlay': {'font_family': "impact", 'font_size': 150, 'text': "Your%20Brand%20Name%20or%20Logo%20Here"}},
  {'opacity': 60},
  {'effect': "distort:arc:-120.0"},
  {'flags': "layer_apply", 'gravity': "south", 'y': 840}
  ])
```

```php
(new ImageTag('frisbee.jpg'))
	->overlay(Overlay::source(
	Source::text("Your Brand Name or Logo Here",(new TextStyle("impact",150)))
	->textColor(Color::WHITE)
	->transformation((new Transformation())
	->adjust(Adjust::opacity(60))
	->reshape(Reshape::distortArc(-120.0)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
->offsetY(840))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .color("white").overlay(new TextLayer().fontFamily("impact").fontSize(150).text("Your%20Brand%20Name%20or%20Logo%20Here")).chain()
  .opacity(60).chain()
  .effect("distort:arc:-120.0").chain()
  .flags("layer_apply").gravity("south").y(840)).imageTag("frisbee.jpg");
```

```ruby
cl_image_tag("frisbee.jpg", transformation: [
  {color: "white", overlay: {font_family: "impact", font_size: 150, text: "Your%20Brand%20Name%20or%20Logo%20Here"}},
  {opacity: 60},
  {effect: "distort:arc:-120.0"},
  {flags: "layer_apply", gravity: "south", y: 840}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Color("white").Overlay(new TextLayer().FontFamily("impact").FontSize(150).Text("Your%20Brand%20Name%20or%20Logo%20Here")).Chain()
  .Opacity(60).Chain()
  .Effect("distort:arc:-120.0").Chain()
  .Flags("layer_apply").Gravity("south").Y(840)).BuildImageTag("frisbee.jpg")
```

```dart
cloudinary.image('frisbee.jpg').transformation(Transformation()
	.addTransformation("co_white,l_text:impact_150:Your Brand Name or Logo Here/o_60/e_distort:arc:-120.0/fl_layer_apply,g_south,y_840"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setColor("white").setOverlay("text:impact_150:Your%20Brand%20Name%20or%20Logo%20Here").chain()
  .setOpacity(60).chain()
  .setEffect("distort:arc:-120.0").chain()
  .setFlags("layer_apply").setGravity("south").setY(840)).generate("frisbee.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .color("white").overlay(new TextLayer().fontFamily("impact").fontSize(150).text("Your%20Brand%20Name%20or%20Logo%20Here")).chain()
  .opacity(60).chain()
  .effect("distort:arc:-120.0").chain()
  .flags("layer_apply").gravity("south").y(840)).generate("frisbee.jpg");
```

```flutter
cloudinary.image('frisbee.jpg').transformation(Transformation()
	.addTransformation("co_white,l_text:impact_150:Your Brand Name or Logo Here/o_60/e_distort:arc:-120.0/fl_layer_apply,g_south,y_840"));
```

```kotlin
cloudinary.image {
	publicId("frisbee.jpg")
	 overlay(Overlay.source(
	Source.text("Your Brand Name or Logo Here",TextStyle("impact",150)) {
	 textColor(Color.WHITE)
	 transformation(Transformation {
	 adjust(Adjust.opacity(60))
	 reshape(Reshape.distortArc(-120.0F)) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
 offsetY(840) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("frisbee.jpg", {transformation: [
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("impact").fontSize(150).text("Your%20Brand%20Name%20or%20Logo%20Here")},
  {opacity: 60},
  {effect: "distort:arc:-120.0"},
  {flags: "layer_apply", gravity: "south", y: 840}
  ]})
```

```react_native
new CloudinaryImage("frisbee.jpg").overlay(
  source(
    text("Your Brand Name or Logo Here", new TextStyle("impact", 150))
      .textColor("white")
      .transformation(
        new Transformation().adjust(opacity(60)).reshape(distortArc("-120.0"))
      )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(840)
  )
);
```

**See full syntax**: [e_distort](transformation_reference#e_distort) in the _Transformation Reference_.

#### Text distortion demo

The CLOUDINARY text in the following demo was created using the [text](image_upload_api_reference#text) method of the Upload API. Try distorting it by entering different values for the corner coordinates.

Select one of the options or manually change the corner coordinates then generate the new distorted text.

 Original
&nbsp;&nbsp;&nbsp;
 Slant
&nbsp;&nbsp;&nbsp;
 Distance
&nbsp;&nbsp;&nbsp;
 Narrow
&nbsp;&nbsp;&nbsp;
 Squash
&nbsp;&nbsp;&nbsp;
 Grow

Top left x,y:

 ,

Top right x,y:

 ,

Bottom left x,y:

 ,

Bottom right x,y:

 ,

Generate Distorted Text

 https://res.cloudinary.com/demo/image/text/e_distort:0:0:604:0:604:74:0:74/docs/cloud-text.png

### Generative AI effects

Cloudinary has a number of transformations that make use of generative AI:

* [Generative background replace](generative_ai_transformations#generative_background_replace): Generate an alternative background for your images
* [Generative fill](generative_ai_transformations#generative_fill): Naturally extend your images to fit new dimensions
* [Generative recolor](generative_ai_transformations#generative_recolor): Recolor aspects of your images
* [Generative remove](generative_ai_transformations#generative_remove): Seamlessly remove parts of your images
* [Generative replace](generative_ai_transformations#generative_replace): Replace items in your images
* [Generative restore](generative_ai_transformations#generative_restore-1): Revitalize degraded images

You can use natural language in most of these transformations as prompts to guide the generation process.

Recolor the shorts 

Extend the image

Replace the shirt

> **TIP**:
>
> :title=Tips:

> * See [Generative AI transformations](generative_ai_transformations) for details.

> * See [AI in Action](ai_in_action) for more uses of AI within Cloudinary.

### Layer blending and masking
**Effects**: `screen`, `multiply`, `overlay`, `mask`, `anti_removal`

These effects are used for blending an overlay with an image.

For example, to make each pixel of the `boy_tree` image brighter according to the pixel value of the overlaid `cloudinary_icon_blue` image:
![Image made brighter according to overlay](https://res.cloudinary.com/demo/image/upload/e_screen,l_cloudinary_icon_blue/boy_tree.jpg "thumb: w_400")

```nodejs
cloudinary.image("boy_tree.jpg", {effect: "screen", overlay: "cloudinary_icon_blue"})
```

```react
new CloudinaryImage("boy_tree.jpg").overlay(
  source(image("cloudinary_icon_blue")).blendMode("screen")
);
```

```vue
new CloudinaryImage("boy_tree.jpg").overlay(
  source(image("cloudinary_icon_blue")).blendMode("screen")
);
```

```angular
new CloudinaryImage("boy_tree.jpg").overlay(
  source(image("cloudinary_icon_blue")).blendMode("screen")
);
```

```js
new CloudinaryImage("boy_tree.jpg").overlay(
  source(image("cloudinary_icon_blue")).blendMode("screen")
);
```

```python
CloudinaryImage("boy_tree.jpg").image(effect="screen", overlay="cloudinary_icon_blue")
```

```php
(new ImageTag('boy_tree.jpg'))
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_blue"))
	->blendMode(
	BlendMode::screen())
	);
```

```java
cloudinary.url().transformation(new Transformation().effect("screen").overlay(new Layer().publicId("cloudinary_icon_blue"))).imageTag("boy_tree.jpg");
```

```ruby
cl_image_tag("boy_tree.jpg", effect: "screen", overlay: "cloudinary_icon_blue")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("screen").Overlay(new Layer().PublicId("cloudinary_icon_blue"))).BuildImageTag("boy_tree.jpg")
```

```dart
cloudinary.image('boy_tree.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue"))
	.blendMode(
	BlendMode.screen())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("screen").setOverlay("cloudinary_icon_blue")).generate("boy_tree.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("screen").overlay(new Layer().publicId("cloudinary_icon_blue"))).generate("boy_tree.jpg");
```

```flutter
cloudinary.image('boy_tree.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue"))
	.blendMode(
	BlendMode.screen())
	));
```

```kotlin
cloudinary.image {
	publicId("boy_tree.jpg")
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_blue")) {
	 blendMode(
	BlendMode.screen())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("boy_tree.jpg", {effect: "screen", overlay: new cloudinary.Layer().publicId("cloudinary_icon_blue")})
```

```react_native
new CloudinaryImage("boy_tree.jpg").overlay(
  source(image("cloudinary_icon_blue")).blendMode("screen")
);
```

**See full syntax**: [e_screen](transformation_reference#e_screen), [e_multiply](transformation_reference#e_multiply), [e_overlay](transformation_reference#e_overlay), [e_mask](transformation_reference#e_mask), [e_anti_removal](transformation_reference#e_anti_removal) in the _Transformation Reference_.

### Outline

The outline effect (`e_outline` in URLs) enables you to add an outline to your **transparent** images. The parameter can also be passed additional values as follows:

```
outline:[mode]:[width]:[blur]
```

* **mode** - how to apply the outline effect which can be one of the following values: `inner`, `inner_fill`, `outer`, `fill`. Default value: `inner` and `outer`.
* **width** - the first integer supplied applies to the thickness of the outline in pixels. Default value: `5`. Range: 1 - 100
* **blur** - the second integer supplied applies to the level of blur of the outline. Default value: `0`. Range: 0 - 2000

Original 

e_outline

e_outline:inner

e_outline:inner_fill

e_outline:outer

e_outline:fill

Use the `color` parameter (`co` in URLs) to define a new color for the outline (the default is `black`). The color can be specified as an RGB hex triplet (e.g., rgb:3e2222), a 3-digit RGB hex (e.g., rgb:777) or a named color (e.g., green). For example, to add an orange outline:

![multiple outlines](https://res.cloudinary.com/demo/image/upload/c_scale,h_200/co_orange,e_outline:15:200/balloon.png)

```nodejs
cloudinary.image("balloon.png", {transformation: [
  {height: 200, crop: "scale"},
  {color: "orange", effect: "outline:15:200"}
  ]})
```

```react
new CloudinaryImage("balloon.png").resize(scale().height(200)).effect(
  outline()
    .width(15)
    .blurLevel(200)
    .color("orange")
);
```

```vue
new CloudinaryImage("balloon.png").resize(scale().height(200)).effect(
  outline()
    .width(15)
    .blurLevel(200)
    .color("orange")
);
```

```angular
new CloudinaryImage("balloon.png").resize(scale().height(200)).effect(
  outline()
    .width(15)
    .blurLevel(200)
    .color("orange")
);
```

```js
new CloudinaryImage("balloon.png").resize(scale().height(200)).effect(
  outline()
    .width(15)
    .blurLevel(200)
    .color("orange")
);
```

```python
CloudinaryImage("balloon.png").image(transformation=[
  {'height': 200, 'crop': "scale"},
  {'color': "orange", 'effect': "outline:15:200"}
  ])
```

```php
(new ImageTag('balloon.png'))
	->resize(Resize::scale()->height(200))
	->effect(Effect::outline()->width(15)
->blurLevel(200)
	->color(Color::ORANGE)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .height(200).crop("scale").chain()
  .color("orange").effect("outline:15:200")).imageTag("balloon.png");
```

```ruby
cl_image_tag("balloon.png", transformation: [
  {height: 200, crop: "scale"},
  {color: "orange", effect: "outline:15:200"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(200).Crop("scale").Chain()
  .Color("orange").Effect("outline:15:200")).BuildImageTag("balloon.png")
```

```dart
cloudinary.image('balloon.png').transformation(Transformation()
	.resize(Resize.scale().height(200))
	.effect(Effect.outline().width(15)
.blurLevel(200)
	.color(Color.ORANGE)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setHeight(200).setCrop("scale").chain()
  .setColor("orange").setEffect("outline:15:200")).generate("balloon.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(200).crop("scale").chain()
  .color("orange").effect("outline:15:200")).generate("balloon.png");
```

```flutter
cloudinary.image('balloon.png').transformation(Transformation()
	.resize(Resize.scale().height(200))
	.effect(Effect.outline().width(15)
.blurLevel(200)
	.color(Color.ORANGE)
	));
```

```kotlin
cloudinary.image {
	publicId("balloon.png")
	 resize(Resize.scale() { height(200) })
	 effect(Effect.outline() { width(15)
 blurLevel(200)
	 color(Color.ORANGE)
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("balloon.png", {transformation: [
  {height: 200, crop: "scale"},
  {color: "orange", effect: "outline:15:200"}
  ]})
```

```react_native
new CloudinaryImage("balloon.png").resize(scale().height(200)).effect(
  outline()
    .width(15)
    .blurLevel(200)
    .color("orange")
);
```

You can also add a multi-colored outline by creating successive outline effect components. For example:

![multiple outlines](https://res.cloudinary.com/demo/image/upload/c_scale,w_200/co_red,e_outline:20:200/co_orange,e_outline:15:200/co_yellow,e_outline:10:200/shoes.png)

```nodejs
cloudinary.image("shoes.png", {transformation: [
  {width: 200, crop: "scale"},
  {color: "red", effect: "outline:20:200"},
  {color: "orange", effect: "outline:15:200"},
  {color: "yellow", effect: "outline:10:200"}
  ]})
```

```react
new CloudinaryImage("shoes.png")
  .resize(scale().width(200))
  .effect(
    outline()
      .width(20)
      .blurLevel(200)
      .color("red")
  )
  .effect(
    outline()
      .width(15)
      .blurLevel(200)
      .color("orange")
  )
  .effect(
    outline()
      .width(10)
      .blurLevel(200)
      .color("yellow")
  );
```

```vue
new CloudinaryImage("shoes.png")
  .resize(scale().width(200))
  .effect(
    outline()
      .width(20)
      .blurLevel(200)
      .color("red")
  )
  .effect(
    outline()
      .width(15)
      .blurLevel(200)
      .color("orange")
  )
  .effect(
    outline()
      .width(10)
      .blurLevel(200)
      .color("yellow")
  );
```

```angular
new CloudinaryImage("shoes.png")
  .resize(scale().width(200))
  .effect(
    outline()
      .width(20)
      .blurLevel(200)
      .color("red")
  )
  .effect(
    outline()
      .width(15)
      .blurLevel(200)
      .color("orange")
  )
  .effect(
    outline()
      .width(10)
      .blurLevel(200)
      .color("yellow")
  );
```

```js
new CloudinaryImage("shoes.png")
  .resize(scale().width(200))
  .effect(
    outline()
      .width(20)
      .blurLevel(200)
      .color("red")
  )
  .effect(
    outline()
      .width(15)
      .blurLevel(200)
      .color("orange")
  )
  .effect(
    outline()
      .width(10)
      .blurLevel(200)
      .color("yellow")
  );
```

```python
CloudinaryImage("shoes.png").image(transformation=[
  {'width': 200, 'crop': "scale"},
  {'color': "red", 'effect': "outline:20:200"},
  {'color': "orange", 'effect': "outline:15:200"},
  {'color': "yellow", 'effect': "outline:10:200"}
  ])
```

```php
(new ImageTag('shoes.png'))
	->resize(Resize::scale()->width(200))
	->effect(Effect::outline()->width(20)
->blurLevel(200)
	->color(Color::RED)
	)
	->effect(Effect::outline()->width(15)
->blurLevel(200)
	->color(Color::ORANGE)
	)
	->effect(Effect::outline()->width(10)
->blurLevel(200)
	->color(Color::YELLOW)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .color("red").effect("outline:20:200").chain()
  .color("orange").effect("outline:15:200").chain()
  .color("yellow").effect("outline:10:200")).imageTag("shoes.png");
```

```ruby
cl_image_tag("shoes.png", transformation: [
  {width: 200, crop: "scale"},
  {color: "red", effect: "outline:20:200"},
  {color: "orange", effect: "outline:15:200"},
  {color: "yellow", effect: "outline:10:200"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(200).Crop("scale").Chain()
  .Color("red").Effect("outline:20:200").Chain()
  .Color("orange").Effect("outline:15:200").Chain()
  .Color("yellow").Effect("outline:10:200")).BuildImageTag("shoes.png")
```

```dart
cloudinary.image('shoes.png').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.effect(Effect.outline().width(20)
.blurLevel(200)
	.color(Color.RED)
	)
	.effect(Effect.outline().width(15)
.blurLevel(200)
	.color(Color.ORANGE)
	)
	.effect(Effect.outline().width(10)
.blurLevel(200)
	.color(Color.YELLOW)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(200).setCrop("scale").chain()
  .setColor("red").setEffect("outline:20:200").chain()
  .setColor("orange").setEffect("outline:15:200").chain()
  .setColor("yellow").setEffect("outline:10:200")).generate("shoes.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .color("red").effect("outline:20:200").chain()
  .color("orange").effect("outline:15:200").chain()
  .color("yellow").effect("outline:10:200")).generate("shoes.png");
```

```flutter
cloudinary.image('shoes.png').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.effect(Effect.outline().width(20)
.blurLevel(200)
	.color(Color.RED)
	)
	.effect(Effect.outline().width(15)
.blurLevel(200)
	.color(Color.ORANGE)
	)
	.effect(Effect.outline().width(10)
.blurLevel(200)
	.color(Color.YELLOW)
	));
```

```kotlin
cloudinary.image {
	publicId("shoes.png")
	 resize(Resize.scale() { width(200) })
	 effect(Effect.outline() { width(20)
 blurLevel(200)
	 color(Color.RED)
	 })
	 effect(Effect.outline() { width(15)
 blurLevel(200)
	 color(Color.ORANGE)
	 })
	 effect(Effect.outline() { width(10)
 blurLevel(200)
	 color(Color.YELLOW)
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("shoes.png", {transformation: [
  {width: 200, crop: "scale"},
  {color: "red", effect: "outline:20:200"},
  {color: "orange", effect: "outline:15:200"},
  {color: "yellow", effect: "outline:10:200"}
  ]})
```

```react_native
new CloudinaryImage("shoes.png")
  .resize(scale().width(200))
  .effect(
    outline()
      .width(20)
      .blurLevel(200)
      .color("red")
  )
  .effect(
    outline()
      .width(15)
      .blurLevel(200)
      .color("orange")
  )
  .effect(
    outline()
      .width(10)
      .blurLevel(200)
      .color("yellow")
  );
```

**See full syntax**: [e_outline](transformation_reference#e_outline) in the _Transformation Reference_.

### Replace color
You can replace a color in an image using the `replace_color` effect. Unless you specify otherwise, the most prominent high-saturation color in an image is selected as the color to change. By default, a tolerance of 50 is applied to this color, representing a radius in the LAB color space, so that similar shades are also replaced, achieving a more natural effect.

> **TIP**: Consider using [Generative recolor](generative_ai_transformations#generative_recolor) if you want to specify particular elements in your image to recolor, rather than everything with the same color.

For example, without specifying a color to change, the most prominent color is changed to the specified `maroon`:

![Image with saturation:50](https://res.cloudinary.com/demo/image/upload/e_replace_color:maroon/blue_burlap.png "with_image: false")

```nodejs
cloudinary.image("blue_burlap.png", {effect: "replace_color:maroon"})
```

```react
new CloudinaryImage("blue_burlap.png").adjust(replaceColor("maroon"));
```

```vue
new CloudinaryImage("blue_burlap.png").adjust(replaceColor("maroon"));
```

```angular
new CloudinaryImage("blue_burlap.png").adjust(replaceColor("maroon"));
```

```js
new CloudinaryImage("blue_burlap.png").adjust(replaceColor("maroon"));
```

```python
CloudinaryImage("blue_burlap.png").image(effect="replace_color:maroon")
```

```php
(new ImageTag('blue_burlap.png'))
	->adjust(Adjust::replaceColor(Color::MAROON));
```

```java
cloudinary.url().transformation(new Transformation().effect("replace_color:maroon")).imageTag("blue_burlap.png");
```

```ruby
cl_image_tag("blue_burlap.png", effect: "replace_color:maroon")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("replace_color:maroon")).BuildImageTag("blue_burlap.png")
```

```dart
cloudinary.image('blue_burlap.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.MAROON)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("replace_color:maroon")).generate("blue_burlap.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("replace_color:maroon")).generate("blue_burlap.png");
```

```flutter
cloudinary.image('blue_burlap.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.MAROON)));
```

```kotlin
cloudinary.image {
	publicId("blue_burlap.png")
	 adjust(Adjust.replaceColor(Color.MAROON)) 
}.generate()
```

```jquery
$.cloudinary.image("blue_burlap.png", {effect: "replace_color:maroon"})
```

```react_native
new CloudinaryImage("blue_burlap.png").adjust(replaceColor("maroon"));
```

Original blue bag

Predominant color recolored

Adding a tolerance value of 10 (`e_replace_color:maroon:10`) prevents the handle also changing color:

![Image with saturation:50](https://res.cloudinary.com/demo/image/upload/e_replace_color:maroon:10/blue_burlap.png "with_image: false")

```nodejs
cloudinary.image("blue_burlap.png", {effect: "replace_color:maroon:10"})
```

```react
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon").tolerance(10)
);
```

```vue
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon").tolerance(10)
);
```

```angular
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon").tolerance(10)
);
```

```js
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon").tolerance(10)
);
```

```python
CloudinaryImage("blue_burlap.png").image(effect="replace_color:maroon:10")
```

```php
(new ImageTag('blue_burlap.png'))
	->adjust(Adjust::replaceColor(Color::MAROON)->tolerance(10));
```

```java
cloudinary.url().transformation(new Transformation().effect("replace_color:maroon:10")).imageTag("blue_burlap.png");
```

```ruby
cl_image_tag("blue_burlap.png", effect: "replace_color:maroon:10")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("replace_color:maroon:10")).BuildImageTag("blue_burlap.png")
```

```dart
cloudinary.image('blue_burlap.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.MAROON).tolerance(10)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("replace_color:maroon:10")).generate("blue_burlap.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("replace_color:maroon:10")).generate("blue_burlap.png");
```

```flutter
cloudinary.image('blue_burlap.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.MAROON).tolerance(10)));
```

```kotlin
cloudinary.image {
	publicId("blue_burlap.png")
	 adjust(Adjust.replaceColor(Color.MAROON) { tolerance(10) }) 
}.generate()
```

```jquery
$.cloudinary.image("blue_burlap.png", {effect: "replace_color:maroon:10"})
```

```react_native
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon").tolerance(10)
);
```

Original blue bag

Handle not recolored

Specifying blue as the color to replace (to a tolerance of 80 from the color #2b38aa) replaces the blue sides with parallel shades of maroon, taking into account shadows, lighting, etc:

![Image with saturation:50](https://res.cloudinary.com/demo/image/upload/e_replace_color:maroon:80:2b38aa/blue_burlap.png "with_image: false")

```nodejs
cloudinary.image("blue_burlap.png", {effect: "replace_color:maroon:80:2b38aa"})
```

```react
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon")
    .fromColor("#2b38aa")
    .tolerance(80)
);
```

```vue
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon")
    .fromColor("#2b38aa")
    .tolerance(80)
);
```

```angular
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon")
    .fromColor("#2b38aa")
    .tolerance(80)
);
```

```js
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon")
    .fromColor("#2b38aa")
    .tolerance(80)
);
```

```python
CloudinaryImage("blue_burlap.png").image(effect="replace_color:maroon:80:2b38aa")
```

```php
(new ImageTag('blue_burlap.png'))
	->adjust(Adjust::replaceColor(Color::MAROON)
	->fromColor(Color::rgb("2b38aa"))
->tolerance(80));
```

```java
cloudinary.url().transformation(new Transformation().effect("replace_color:maroon:80:2b38aa")).imageTag("blue_burlap.png");
```

```ruby
cl_image_tag("blue_burlap.png", effect: "replace_color:maroon:80:2b38aa")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("replace_color:maroon:80:2b38aa")).BuildImageTag("blue_burlap.png")
```

```dart
cloudinary.image('blue_burlap.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.MAROON)
	.fromColor(Color.rgb("2b38aa"))
.tolerance(80)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("replace_color:maroon:80:2b38aa")).generate("blue_burlap.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("replace_color:maroon:80:2b38aa")).generate("blue_burlap.png");
```

```flutter
cloudinary.image('blue_burlap.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.MAROON)
	.fromColor(Color.rgb("2b38aa"))
.tolerance(80)));
```

```kotlin
cloudinary.image {
	publicId("blue_burlap.png")
	 adjust(Adjust.replaceColor(Color.MAROON) {
	 fromColor(Color.rgb("2b38aa"))
 tolerance(80) }) 
}.generate()
```

```jquery
$.cloudinary.image("blue_burlap.png", {effect: "replace_color:maroon:80:2b38aa"})
```

```react_native
new CloudinaryImage("blue_burlap.png").adjust(
  replaceColor("maroon")
    .fromColor("#2b38aa")
    .tolerance(80)
);
```

Original blue bag

Blues recolored to maroon shades

**See full syntax**: [e_replace_color](transformation_reference#e_replace_color) in the _Transformation Reference_.

### Rotation
Rotate an image by any arbitrary angle in degrees with the `angle` parameter (`a` in URLs). A positive integer value rotates the image clockwise, and a negative integer value rotates the image counterclockwise. If the angle is not a multiple of 90 then a rectangular transparent bounding box is added containing the rotated image and empty space. In these cases, it's recommended to deliver the image in a transparent format if the background is not white.

> **NOTE**: If either the width or height of an image exceeds 3000 pixels, the image is automatically downscaled first, and then rotated. This applies to the image that is the input to the rotation, be it the output of a chained transformation or the original image.

You can also take advantage of special angle-rotation modes, such as `a_hflip / a_vflip` to horizontally or vertically mirror flip an image, `a_auto_right` / `a_auto_left` to rotate an image 90 degrees only if the requested aspect ratio is different than the original image's aspect ratio, or `a_ignore` to prevent Cloudinary from automatically rotating images based on the images's stored EXIF details. 

For details on these rotation modes, see the [Transformation Reference](transformation_reference#a_mode).

#### Rotation examples 

The following images apply various rotation options to the `cutlery` image:

1. Rotate the image by 90 degrees:  
    ![Image rotated 90 degrees clockwise](https://res.cloudinary.com/demo/image/upload/c_scale,w_200/a_90/docs/cutlery.jpg)

```nodejs
cloudinary.image("docs/cutlery.jpg", {transformation: [
  {width: 200, crop: "scale"},
  {angle: 90}
  ]})
```

```react
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(90));
```

```vue
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(90));
```

```angular
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(90));
```

```js
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(90));
```

```python
CloudinaryImage("docs/cutlery.jpg").image(transformation=[
  {'width': 200, 'crop': "scale"},
  {'angle': 90}
  ])
```

```php
(new ImageTag('docs/cutlery.jpg'))
	->resize(Resize::scale()->width(200))
	->rotate(Rotate::byAngle(90));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .angle(90)).imageTag("docs/cutlery.jpg");
```

```ruby
cl_image_tag("docs/cutlery.jpg", transformation: [
  {width: 200, crop: "scale"},
  {angle: 90}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(200).Crop("scale").Chain()
  .Angle(90)).BuildImageTag("docs/cutlery.jpg")
```

```dart
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.rotate(Rotate.byAngle(90)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(200).setCrop("scale").chain()
  .setAngle(90)).generate("docs/cutlery.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .angle(90)).generate("docs/cutlery.jpg");
```

```flutter
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.rotate(Rotate.byAngle(90)));
```

```kotlin
cloudinary.image {
	publicId("docs/cutlery.jpg")
	 resize(Resize.scale() { width(200) })
	 rotate(Rotate.byAngle(90)) 
}.generate()
```

```jquery
$.cloudinary.image("docs/cutlery.jpg", {transformation: [
  {width: 200, crop: "scale"},
  {angle: 90}
  ]})
```

```react_native
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(90));
```
2. Rotate the image by -20 degrees (automatically adds a transparent bounding box):  
    ![Image rotated 20 degrees counterclockwise](https://res.cloudinary.com/demo/image/upload/c_scale,w_200/a_-20/docs/cutlery.jpg)

```nodejs
cloudinary.image("docs/cutlery.jpg", {transformation: [
  {width: 200, crop: "scale"},
  {angle: -20}
  ]})
```

```react
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(-20));
```

```vue
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(-20));
```

```angular
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(-20));
```

```js
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(-20));
```

```python
CloudinaryImage("docs/cutlery.jpg").image(transformation=[
  {'width': 200, 'crop': "scale"},
  {'angle': -20}
  ])
```

```php
(new ImageTag('docs/cutlery.jpg'))
	->resize(Resize::scale()->width(200))
	->rotate(Rotate::byAngle(-20));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .angle(-20)).imageTag("docs/cutlery.jpg");
```

```ruby
cl_image_tag("docs/cutlery.jpg", transformation: [
  {width: 200, crop: "scale"},
  {angle: -20}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(200).Crop("scale").Chain()
  .Angle(-20)).BuildImageTag("docs/cutlery.jpg")
```

```dart
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.rotate(Rotate.byAngle(-20)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(200).setCrop("scale").chain()
  .setAngle(-20)).generate("docs/cutlery.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .angle(-20)).generate("docs/cutlery.jpg");
```

```flutter
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.rotate(Rotate.byAngle(-20)));
```

```kotlin
cloudinary.image {
	publicId("docs/cutlery.jpg")
	 resize(Resize.scale() { width(200) })
	 rotate(Rotate.byAngle(-20)) 
}.generate()
```

```jquery
$.cloudinary.image("docs/cutlery.jpg", {transformation: [
  {width: 200, crop: "scale"},
  {angle: -20}
  ]})
```

```react_native
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(byAngle(-20));
```
3. Vertically mirror flip the image and rotate by 45 degrees (automatically adds a transparent bounding box):  
    ![Image vertically flipped and rotated 45 degrees clockwise](https://res.cloudinary.com/demo/image/upload/c_scale,w_200/a_vflip/a_45/docs/cutlery.jpg)

```nodejs
cloudinary.image("docs/cutlery.jpg", {transformation: [
  {width: 200, crop: "scale"},
  {angle: "vflip"},
  {angle: 45}
  ]})
```

```react
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(mode(verticalFlip()))
  .rotate(byAngle(45));
```

```vue
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(mode(verticalFlip()))
  .rotate(byAngle(45));
```

```angular
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(mode(verticalFlip()))
  .rotate(byAngle(45));
```

```js
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(mode(verticalFlip()))
  .rotate(byAngle(45));
```

```python
CloudinaryImage("docs/cutlery.jpg").image(transformation=[
  {'width': 200, 'crop': "scale"},
  {'angle': "vflip"},
  {'angle': 45}
  ])
```

```php
(new ImageTag('docs/cutlery.jpg'))
	->resize(Resize::scale()->width(200))
	->rotate(Rotate::mode(
	RotationMode::verticalFlip()))
	->rotate(Rotate::byAngle(45));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .angle("vflip").chain()
  .angle(45)).imageTag("docs/cutlery.jpg");
```

```ruby
cl_image_tag("docs/cutlery.jpg", transformation: [
  {width: 200, crop: "scale"},
  {angle: "vflip"},
  {angle: 45}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(200).Crop("scale").Chain()
  .Angle("vflip").Chain()
  .Angle(45)).BuildImageTag("docs/cutlery.jpg")
```

```dart
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.rotate(Rotate.mode(
	RotationMode.verticalFlip()))
	.rotate(Rotate.byAngle(45)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(200).setCrop("scale").chain()
  .setAngle("vflip").chain()
  .setAngle(45)).generate("docs/cutlery.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(200).crop("scale").chain()
  .angle("vflip").chain()
  .angle(45)).generate("docs/cutlery.jpg");
```

```flutter
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.resize(Resize.scale().width(200))
	.rotate(Rotate.mode(
	RotationMode.verticalFlip()))
	.rotate(Rotate.byAngle(45)));
```

```kotlin
cloudinary.image {
	publicId("docs/cutlery.jpg")
	 resize(Resize.scale() { width(200) })
	 rotate(Rotate.mode(
	RotationMode.verticalFlip()))
	 rotate(Rotate.byAngle(45)) 
}.generate()
```

```jquery
$.cloudinary.image("docs/cutlery.jpg", {transformation: [
  {width: 200, crop: "scale"},
  {angle: "vflip"},
  {angle: 45}
  ]})
```

```react_native
new CloudinaryImage("docs/cutlery.jpg")
  .resize(scale().width(200))
  .rotate(mode(verticalFlip()))
  .rotate(byAngle(45));
```
4. Crop the image to a 200x200 circle, then rotate the image by 30 degrees (automatically adds a transparent bounding box) and finally trim the extra whitespace added:
    ![image cropped to a 200x200 circle, rotated 30 degrees clockwise and trimmed](https://res.cloudinary.com/demo/image/upload/c_fill,h_200,w_300/r_max/a_30/e_trim/docs/cutlery.jpg)

```nodejs
cloudinary.image("docs/cutlery.jpg", {transformation: [
  {height: 200, width: 300, crop: "fill"},
  {radius: "max"},
  {angle: 30},
  {effect: "trim"}
  ]})
```

```react
new CloudinaryImage("docs/cutlery.jpg")
  .resize(fill().width(300).height(200))
  .roundCorners(max())
  .rotate(byAngle(30))
  .reshape(trim());
```

```vue
new CloudinaryImage("docs/cutlery.jpg")
  .resize(fill().width(300).height(200))
  .roundCorners(max())
  .rotate(byAngle(30))
  .reshape(trim());
```

```angular
new CloudinaryImage("docs/cutlery.jpg")
  .resize(fill().width(300).height(200))
  .roundCorners(max())
  .rotate(byAngle(30))
  .reshape(trim());
```

```js
new CloudinaryImage("docs/cutlery.jpg")
  .resize(fill().width(300).height(200))
  .roundCorners(max())
  .rotate(byAngle(30))
  .reshape(trim());
```

```python
CloudinaryImage("docs/cutlery.jpg").image(transformation=[
  {'height': 200, 'width': 300, 'crop': "fill"},
  {'radius': "max"},
  {'angle': 30},
  {'effect': "trim"}
  ])
```

```php
(new ImageTag('docs/cutlery.jpg'))
	->resize(Resize::fill()->width(300)
->height(200))
	->roundCorners(RoundCorners::max())
	->rotate(Rotate::byAngle(30))
	->reshape(Reshape::trim());
```

```java
cloudinary.url().transformation(new Transformation()
  .height(200).width(300).crop("fill").chain()
  .radius("max").chain()
  .angle(30).chain()
  .effect("trim")).imageTag("docs/cutlery.jpg");
```

```ruby
cl_image_tag("docs/cutlery.jpg", transformation: [
  {height: 200, width: 300, crop: "fill"},
  {radius: "max"},
  {angle: 30},
  {effect: "trim"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(200).Width(300).Crop("fill").Chain()
  .Radius("max").Chain()
  .Angle(30).Chain()
  .Effect("trim")).BuildImageTag("docs/cutlery.jpg")
```

```dart
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.resize(Resize.fill().width(300)
.height(200))
	.roundCorners(RoundCorners.max())
	.rotate(Rotate.byAngle(30))
	.reshape(Reshape.trim()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setHeight(200).setWidth(300).setCrop("fill").chain()
  .setRadius("max").chain()
  .setAngle(30).chain()
  .setEffect("trim")).generate("docs/cutlery.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(200).width(300).crop("fill").chain()
  .radius("max").chain()
  .angle(30).chain()
  .effect("trim")).generate("docs/cutlery.jpg");
```

```flutter
cloudinary.image('docs/cutlery.jpg').transformation(Transformation()
	.addTransformation("c_fill,h_200,w_300/r_max/a_30/e_trim"));
```

```kotlin
cloudinary.image {
	publicId("docs/cutlery.jpg")
	 resize(Resize.fill() { width(300)
 height(200) })
	 roundCorners(RoundCorners.max())
	 rotate(Rotate.byAngle(30))
	 reshape(Reshape.trim()) 
}.generate()
```

```jquery
$.cloudinary.image("docs/cutlery.jpg", {transformation: [
  {height: 200, width: 300, crop: "fill"},
  {radius: "max"},
  {angle: 30},
  {effect: "trim"}
  ]})
```

```react_native
new CloudinaryImage("docs/cutlery.jpg")
  .resize(fill().width(300).height(200))
  .roundCorners(max())
  .rotate(byAngle(30))
  .reshape(trim());
```

**See full syntax**: [a (angle)](transformation_reference#a_angle) in the _Transformation Reference_.

**Try it out**: [Rotate](https://console.cloudinary.com/app/image/home/rotate?media=image&collection=food&sample=me%2Frotate-food-1.png&rotate=90&flip=none).

### Rounding
Many website designs need images with rounded corners, while some websites require images with a complete circular or oval (ellipse) crop. Twitter, for example, uses rounded corners for its users' profile pictures.

Programmatically, rounded corners can be achieved using the original rectangular images combined with modern CSS properties or image masking overlays. However, it is sometimes useful to deliver images with rounded corners in the first place. This is particularly helpful when you want to embed images inside an email (most mail clients can't add CSS based rounded corners), a PDF or a mobile application. Delivering images with already rounded corners is also useful if you want to simplify your CSS and markup or when you need to support older browsers.

Transforming an image to a rounded version is done using the `radius` parameter (`r` in URLs). You can manually specify the amount to round various corners, or you can set it to automatically round to an exact ellipse or circle.

> **NOTE**: To deliver a rounded image with a transparent background, deliver as PNG. Formats that do not support transparency will be delivered by default with a white background, which can be adjusted with the `background` transformation parameter. Keep in mind that the PNG format produces larger files than the JPEG format. For more information, see the article on [PNG optimization - saving bandwidth on transparent PNGs with dynamic underlay](/blog/png_optimization_saving_bandwidth_on_transparent_pngs_with_dynamic_underlay).

#### Manually setting rounding values
To manually control the rounding, use the `radius` parameter with between 1 and 4 values defining the rounding amount (in pixels, separated by colons), following the same concept as the **border-radius** CSS property. When specifying multiple values, keep a corner untouched by specifying '0'.

* **One value**: Symmetrical. All four corners are rounded equally according to the specified value.
* **Two values**: Opposites are symmetrical. The first value applies to the top-left and bottom-right corners. The second value applies to the top-right and bottom-left corners.
* **Three values**: One set of corners is symmetrical. The first value applies to the top-left. The second value applies to the top-right and bottom-left corners. The third value applies to the bottom-right.
* **Four values**: The rounding for each corner is specified separately, in clockwise order, starting with the top-left. 

For example:

r_20 

r_25:0&nbsp;&nbsp;&nbsp;

r_10:40:25&nbsp;&nbsp;&nbsp;

r_30:0:30:30&nbsp;&nbsp;&nbsp;

![Opposite corners are rounded](https://res.cloudinary.com/demo/image/upload/c_fill,h_100,w_150/r_25:0/Pi.png "with_image:false")

```nodejs
cloudinary.image("Pi.png", {transformation: [
  {height: 100, width: 150, crop: "fill"},
  {radius: "25:0"}
  ]})
```

```react
new CloudinaryImage("Pi.png")
  .resize(fill().width(150).height(100))
  .roundCorners(byRadius(25, 0));
```

```vue
new CloudinaryImage("Pi.png")
  .resize(fill().width(150).height(100))
  .roundCorners(byRadius(25, 0));
```

```angular
new CloudinaryImage("Pi.png")
  .resize(fill().width(150).height(100))
  .roundCorners(byRadius(25, 0));
```

```js
new CloudinaryImage("Pi.png")
  .resize(fill().width(150).height(100))
  .roundCorners(byRadius(25, 0));
```

```python
CloudinaryImage("Pi.png").image(transformation=[
  {'height': 100, 'width': 150, 'crop': "fill"},
  {'radius': "25:0"}
  ])
```

```php
(new ImageTag('Pi.png'))
	->resize(Resize::fill()->width(150)
->height(100))
	->roundCorners(RoundCorners::byRadius(25,0));
```

```java
cloudinary.url().transformation(new Transformation()
  .height(100).width(150).crop("fill").chain()
  .radius("25:0")).imageTag("Pi.png");
```

```ruby
cl_image_tag("Pi.png", transformation: [
  {height: 100, width: 150, crop: "fill"},
  {radius: "25:0"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(100).Width(150).Crop("fill").Chain()
  .Radius("25:0")).BuildImageTag("Pi.png")
```

```dart
cloudinary.image('Pi.png').transformation(Transformation()
	.resize(Resize.fill().width(150)
.height(100))
	.roundCorners(RoundCorners.byRadius(25,0)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setHeight(100).setWidth(150).setCrop("fill").chain()
  .setRadius("25:0")).generate("Pi.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(100).width(150).crop("fill").chain()
  .radius("25:0")).generate("Pi.png");
```

```flutter
cloudinary.image('Pi.png').transformation(Transformation()
	.addTransformation("c_fill,h_100,w_150/r_25:0"));
```

```kotlin
cloudinary.image {
	publicId("Pi.png")
	 resize(Resize.fill() { width(150)
 height(100) })
	 roundCorners(RoundCorners.byRadius(25,0)) 
}.generate()
```

```jquery
$.cloudinary.image("Pi.png", {transformation: [
  {height: 100, width: 150, crop: "fill"},
  {radius: "25:0"}
  ]})
```

```react_native
new CloudinaryImage("Pi.png")
  .resize(fill().width(150).height(100))
  .roundCorners(byRadius(25, 0));
```

#### Automatically rounding to an ellipse or circle

Rather than specifying specific rounding values, you can automatically crop images to the shape of an ellipse (if the requested image size is a rectangle) or a circle (if the requested image size is a square). Simply pass `max` as the value of the `radius` parameter instead of numeric values.

The following example transforms an uploaded JPEG to a 250x150 PNG with maximum radius cropping, which generates the ellipse shape with a transparent background:

![150x100 ellipsoid image](https://res.cloudinary.com/demo/image/upload/c_fill,h_150,w_250/r_max/pi.png)

```nodejs
cloudinary.image("pi.png", {transformation: [
  {height: 150, width: 250, crop: "fill"},
  {radius: "max"}
  ]})
```

```react
new CloudinaryImage("pi.png")
  .resize(fill().width(250).height(150))
  .roundCorners(max());
```

```vue
new CloudinaryImage("pi.png")
  .resize(fill().width(250).height(150))
  .roundCorners(max());
```

```angular
new CloudinaryImage("pi.png")
  .resize(fill().width(250).height(150))
  .roundCorners(max());
```

```js
new CloudinaryImage("pi.png")
  .resize(fill().width(250).height(150))
  .roundCorners(max());
```

```python
CloudinaryImage("pi.png").image(transformation=[
  {'height': 150, 'width': 250, 'crop': "fill"},
  {'radius': "max"}
  ])
```

```php
(new ImageTag('pi.png'))
	->resize(Resize::fill()->width(250)
->height(150))
	->roundCorners(RoundCorners::max());
```

```java
cloudinary.url().transformation(new Transformation()
  .height(150).width(250).crop("fill").chain()
  .radius("max")).imageTag("pi.png");
```

```ruby
cl_image_tag("pi.png", transformation: [
  {height: 150, width: 250, crop: "fill"},
  {radius: "max"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(150).Width(250).Crop("fill").Chain()
  .Radius("max")).BuildImageTag("pi.png")
```

```dart
cloudinary.image('pi.png').transformation(Transformation()
	.resize(Resize.fill().width(250)
.height(150))
	.roundCorners(RoundCorners.max()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setHeight(150).setWidth(250).setCrop("fill").chain()
  .setRadius("max")).generate("pi.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(150).width(250).crop("fill").chain()
  .radius("max")).generate("pi.png");
```

```flutter
cloudinary.image('pi.png').transformation(Transformation()
	.addTransformation("c_fill,h_150,w_250/r_max"));
```

```kotlin
cloudinary.image {
	publicId("pi.png")
	 resize(Resize.fill() { width(250)
 height(150) })
	 roundCorners(RoundCorners.max()) 
}.generate()
```

```jquery
$.cloudinary.image("pi.png", {transformation: [
  {height: 150, width: 250, crop: "fill"},
  {radius: "max"}
  ]})
```

```react_native
new CloudinaryImage("pi.png")
  .resize(fill().width(250).height(150))
  .roundCorners(max());
```

As the following example shows, displaying pictures of your web site's users as circle headshots is very easy to achieve with Cloudinary using `face` gravity with `max` radius:

![100x100 face thumbnail with max radius](https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_200,w_200/r_max/face_left.png)

```nodejs
cloudinary.image("face_left.png", {transformation: [
  {gravity: "face", height: 200, width: 200, crop: "thumb"},
  {radius: "max"}
  ]})
```

```react
new CloudinaryImage("face_left.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max());
```

```vue
new CloudinaryImage("face_left.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max());
```

```angular
new CloudinaryImage("face_left.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max());
```

```js
new CloudinaryImage("face_left.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max());
```

```python
CloudinaryImage("face_left.png").image(transformation=[
  {'gravity': "face", 'height': 200, 'width': 200, 'crop': "thumb"},
  {'radius': "max"}
  ])
```

```php
(new ImageTag('face_left.png'))
	->resize(Resize::thumbnail()->width(200)
->height(200)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	)
	->roundCorners(RoundCorners::max());
```

```java
cloudinary.url().transformation(new Transformation()
  .gravity("face").height(200).width(200).crop("thumb").chain()
  .radius("max")).imageTag("face_left.png");
```

```ruby
cl_image_tag("face_left.png", transformation: [
  {gravity: "face", height: 200, width: 200, crop: "thumb"},
  {radius: "max"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Gravity("face").Height(200).Width(200).Crop("thumb").Chain()
  .Radius("max")).BuildImageTag("face_left.png")
```

```dart
cloudinary.image('face_left.png').transformation(Transformation()
	.resize(Resize.thumbnail().width(200)
.height(200)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	)
	.roundCorners(RoundCorners.max()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setGravity("face").setHeight(200).setWidth(200).setCrop("thumb").chain()
  .setRadius("max")).generate("face_left.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .gravity("face").height(200).width(200).crop("thumb").chain()
  .radius("max")).generate("face_left.png");
```

```flutter
cloudinary.image('face_left.png').transformation(Transformation()
	.addTransformation("c_thumb,g_face,h_200,w_200/r_max"));
```

```kotlin
cloudinary.image {
	publicId("face_left.png")
	 resize(Resize.thumbnail() { width(200)
 height(200)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 })
	 roundCorners(RoundCorners.max()) 
}.generate()
```

```jquery
$.cloudinary.image("face_left.png", {transformation: [
  {gravity: "face", height: 200, width: 200, crop: "thumb"},
  {radius: "max"}
  ]})
```

```react_native
new CloudinaryImage("face_left.png")
  .resize(
    thumbnail()
      .width(200)
      .height(200)
      .gravity(focusOn(face()))
  )
  .roundCorners(max());
```

You can also overlay circular pictures of your users on other images using the `layer_apply` flag that tells Cloudinary to apply the rounding (and other transformations) to the overlay image and not to the base image:

![Face thumbnail on base image](https://res.cloudinary.com/demo/image/upload/l_face_left/c_thumb,g_face,h_450,w_450/r_max/fl_layer_apply,g_north_east,x_25,y_25/sunset_lake.jpg "thumb: w_400")

```nodejs
cloudinary.image("sunset_lake.jpg", {transformation: [
  {overlay: "face_left"},
  {gravity: "face", height: 450, width: 450, crop: "thumb"},
  {radius: "max"},
  {flags: "layer_apply", gravity: "north_east", x: 25, y: 25}
  ]})
```

```react
new CloudinaryImage("sunset_lake.jpg").overlay(
  source(
    image("face_left").transformation(
      new Transformation()
        .resize(thumbnail().width(450).height(450).gravity(focusOn(face())))
        .roundCorners(max())
    )
  ).position(
    new Position()
      .gravity(compass("north_east"))
      .offsetX(25)
      .offsetY(25)
  )
);
```

```vue
new CloudinaryImage("sunset_lake.jpg").overlay(
  source(
    image("face_left").transformation(
      new Transformation()
        .resize(thumbnail().width(450).height(450).gravity(focusOn(face())))
        .roundCorners(max())
    )
  ).position(
    new Position()
      .gravity(compass("north_east"))
      .offsetX(25)
      .offsetY(25)
  )
);
```

```angular
new CloudinaryImage("sunset_lake.jpg").overlay(
  source(
    image("face_left").transformation(
      new Transformation()
        .resize(thumbnail().width(450).height(450).gravity(focusOn(face())))
        .roundCorners(max())
    )
  ).position(
    new Position()
      .gravity(compass("north_east"))
      .offsetX(25)
      .offsetY(25)
  )
);
```

```js
new CloudinaryImage("sunset_lake.jpg").overlay(
  source(
    image("face_left").transformation(
      new Transformation()
        .resize(thumbnail().width(450).height(450).gravity(focusOn(face())))
        .roundCorners(max())
    )
  ).position(
    new Position()
      .gravity(compass("north_east"))
      .offsetX(25)
      .offsetY(25)
  )
);
```

```python
CloudinaryImage("sunset_lake.jpg").image(transformation=[
  {'overlay': "face_left"},
  {'gravity': "face", 'height': 450, 'width': 450, 'crop': "thumb"},
  {'radius': "max"},
  {'flags': "layer_apply", 'gravity': "north_east", 'x': 25, 'y': 25}
  ])
```

```php
(new ImageTag('sunset_lake.jpg'))
	->overlay(Overlay::source(
	Source::image("face_left")
	->transformation((new Transformation())
	->resize(Resize::thumbnail()->width(450)
->height(450)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	)
	->roundCorners(RoundCorners::max()))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
->offsetX(25)
->offsetY(25))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("face_left")).chain()
  .gravity("face").height(450).width(450).crop("thumb").chain()
  .radius("max").chain()
  .flags("layer_apply").gravity("north_east").x(25).y(25)).imageTag("sunset_lake.jpg");
```

```ruby
cl_image_tag("sunset_lake.jpg", transformation: [
  {overlay: "face_left"},
  {gravity: "face", height: 450, width: 450, crop: "thumb"},
  {radius: "max"},
  {flags: "layer_apply", gravity: "north_east", x: 25, y: 25}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("face_left")).Chain()
  .Gravity("face").Height(450).Width(450).Crop("thumb").Chain()
  .Radius("max").Chain()
  .Flags("layer_apply").Gravity("north_east").X(25).Y(25)).BuildImageTag("sunset_lake.jpg")
```

```dart
cloudinary.image('sunset_lake.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("face_left")
	.transformation(new Transformation()
	.resize(Resize.thumbnail().width(450)
.height(450)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	)
	.roundCorners(RoundCorners.max()))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
.offsetX(25)
.offsetY(25))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("face_left").chain()
  .setGravity("face").setHeight(450).setWidth(450).setCrop("thumb").chain()
  .setRadius("max").chain()
  .setFlags("layer_apply").setGravity("north_east").setX(25).setY(25)).generate("sunset_lake.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("face_left")).chain()
  .gravity("face").height(450).width(450).crop("thumb").chain()
  .radius("max").chain()
  .flags("layer_apply").gravity("north_east").x(25).y(25)).generate("sunset_lake.jpg");
```

```flutter
cloudinary.image('sunset_lake.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("face_left")
	.transformation(new Transformation()
	.addTransformation())
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
.offsetX(25)
.offsetY(25))
	));
```

```kotlin
cloudinary.image {
	publicId("sunset_lake.jpg")
	 overlay(Overlay.source(
	Source.image("face_left") {
	 transformation(Transformation {
	 resize(Resize.thumbnail() { width(450)
 height(450)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 })
	 roundCorners(RoundCorners.max()) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
 offsetX(25)
 offsetY(25) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("sunset_lake.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("face_left")},
  {gravity: "face", height: 450, width: 450, crop: "thumb"},
  {radius: "max"},
  {flags: "layer_apply", gravity: "north_east", x: 25, y: 25}
  ]})
```

```react_native
new CloudinaryImage("sunset_lake.jpg").overlay(
  source(
    image("face_left").transformation(
      new Transformation()
        .resize(thumbnail().width(450).height(450).gravity(focusOn(face())))
        .roundCorners(max())
    )
  ).position(
    new Position()
      .gravity(compass("north_east"))
      .offsetX(25)
      .offsetY(25)
  )
);
```

**See full syntax**: [r (round corners)](transformation_reference#r_round_corners) in the _Transformation Reference_.

**Try it out**: [Round corners](https://console.cloudinary.com/app/image/home/round-corners?media=image&collection=portrait&sample=me%2Frc%2Fportrait-1.png&mode=maximum&smartCrop=true).

### Shadow

There are two ways to add shadow to your images:

* Use the [shadow](#shadow_effect) effect to apply a shadow to the edge of the image.
* Use the [dropshadow](#dropshadow_effect) effect to apply a shadow to objects in the image.

#### Shadow effect

The [shadow](transformation_reference#e_shadow) effect (`e_shadow` in URLs) applies a shadow to the edge of the image. You can use this effect to make it look like your image is hovering slightly above the page.

In this example, a dark blue shadow with medium blurring of its edges (`co_rgb:483d8b,e_shadow:50`) is added with an offset of 60 pixels to the top right of the photo (`x_60,y_-60`): 

![Photo of Stockholm with shadow effect](https://res.cloudinary.com/demo/image/upload/co_rgb:483d8b,e_shadow:50,x_60,y_-60/docs/stockholm.jpg "thumb: q_auto/f_auto/w_400")

```nodejs
cloudinary.image("docs/stockholm.jpg", {color: "#483d8b", effect: "shadow:50", x: 60, y: -60})
```

```react
new CloudinaryImage("docs/stockholm.jpg").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```vue
new CloudinaryImage("docs/stockholm.jpg").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```angular
new CloudinaryImage("docs/stockholm.jpg").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```js
new CloudinaryImage("docs/stockholm.jpg").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```python
CloudinaryImage("docs/stockholm.jpg").image(color="#483d8b", effect="shadow:50", x=60, y=-60)
```

```php
(new ImageTag('docs/stockholm.jpg'))
	->effect(Effect::shadow()->strength(50)
	->color(Color::rgb("483d8b"))
->offsetX(60)
->offsetY(-60));
```

```java
cloudinary.url().transformation(new Transformation().color("#483d8b").effect("shadow:50").x(60).y(-60)).imageTag("docs/stockholm.jpg");
```

```ruby
cl_image_tag("docs/stockholm.jpg", color: "#483d8b", effect: "shadow:50", x: 60, y: -60)
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Color("#483d8b").Effect("shadow:50").X(60).Y(-60)).BuildImageTag("docs/stockholm.jpg")
```

```dart
cloudinary.image('docs/stockholm.jpg').transformation(Transformation()
	.effect(Effect.shadow().strength(50)
	.color(Color.rgb("483d8b"))
.offsetX(60)
.offsetY(-60)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setColor("#483d8b").setEffect("shadow:50").setX(60).setY(-60)).generate("docs/stockholm.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().color("#483d8b").effect("shadow:50").x(60).y(-60)).generate("docs/stockholm.jpg");
```

```flutter
cloudinary.image('docs/stockholm.jpg').transformation(Transformation()
	.effect(Effect.shadow().strength(50)
	.color(Color.rgb("483d8b"))
.offsetX(60)
.offsetY(-60)));
```

```kotlin
cloudinary.image {
	publicId("docs/stockholm.jpg")
	 effect(Effect.shadow() { strength(50)
	 color(Color.rgb("483d8b"))
 offsetX(60)
 offsetY(-60) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/stockholm.jpg", {color: "#483d8b", effect: "shadow:50", x: 60, y: -60})
```

```react_native
new CloudinaryImage("docs/stockholm.jpg").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

If your image has transparency, the shadow is added to the edge of the non-transparent part, for example, adding the same shadow to the lipstick in this image:

![Transparent photo of lipstick with shadow effect](https://res.cloudinary.com/demo/image/upload/co_rgb:483d8b,e_shadow:50,x_60,y_-60/docs/rmv_bgd/lipstick-png "thumb: q_auto/f_auto/w_400")

```nodejs
cloudinary.image("docs/rmv_bgd/lipstick-png", {color: "#483d8b", effect: "shadow:50", x: 60, y: -60})
```

```react
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```vue
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```angular
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```js
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

```python
CloudinaryImage("docs/rmv_bgd/lipstick-png").image(color="#483d8b", effect="shadow:50", x=60, y=-60)
```

```php
(new ImageTag('docs/rmv_bgd/lipstick-png'))
	->effect(Effect::shadow()->strength(50)
	->color(Color::rgb("483d8b"))
->offsetX(60)
->offsetY(-60));
```

```java
cloudinary.url().transformation(new Transformation().color("#483d8b").effect("shadow:50").x(60).y(-60)).imageTag("docs/rmv_bgd/lipstick-png");
```

```ruby
cl_image_tag("docs/rmv_bgd/lipstick-png", color: "#483d8b", effect: "shadow:50", x: 60, y: -60)
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Color("#483d8b").Effect("shadow:50").X(60).Y(-60)).BuildImageTag("docs/rmv_bgd/lipstick-png")
```

```dart
cloudinary.image('docs/rmv_bgd/lipstick-png').transformation(Transformation()
	.effect(Effect.shadow().strength(50)
	.color(Color.rgb("483d8b"))
.offsetX(60)
.offsetY(-60)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setColor("#483d8b").setEffect("shadow:50").setX(60).setY(-60)).generate("docs/rmv_bgd/lipstick-png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().color("#483d8b").effect("shadow:50").x(60).y(-60)).generate("docs/rmv_bgd/lipstick-png");
```

```flutter
cloudinary.image('docs/rmv_bgd/lipstick-png').transformation(Transformation()
	.effect(Effect.shadow().strength(50)
	.color(Color.rgb("483d8b"))
.offsetX(60)
.offsetY(-60)));
```

```kotlin
cloudinary.image {
	publicId("docs/rmv_bgd/lipstick-png")
	 effect(Effect.shadow() { strength(50)
	 color(Color.rgb("483d8b"))
 offsetX(60)
 offsetY(-60) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/rmv_bgd/lipstick-png", {color: "#483d8b", effect: "shadow:50", x: 60, y: -60})
```

```react_native
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  shadow()
    .strength(50)
    .color("#483d8b")
    .offsetX(60)
    .offsetY(-60)
);
```

For a more realistic shadow, use the [dropshadow effect](#dropshadow_effect).

**See full syntax**: [e_shadow](transformation_reference#e_shadow) in the _Transformation Reference_.

#### Dropshadow effect

The [dropshadow](transformation_reference#e_dropshadow) effect (`e_dropshadow` in URLs) uses AI to apply a realistic shadow to an object or objects in the image. 

You can use this effect to apply consistent shadows across a set of product images, where [background removal](background_removal) has been used.

To create the shadow, specify the position of the light source, using azimuth and elevation as shown in this diagram, where north (0 / 360 degrees) is behind the object:

![Diagram showing azimuth and elevation](https://cloudinary-res.cloudinary.com/image/upload/f_auto/q_auto/docs/light_angles.png "thumb: w_400/dpr_2.0, width:400, popup:true")

You can also specify a spread from 0 to 100, where the smaller the number, the closer the light source is to 'point' light, and larger numbers mean 'area' light.

The following example has a light source set up at an azimuth of 220 degrees, an elevation of 40 degrees above 'ground' and where the spread of the light source is 20% (`e_dropshadow:azimuth_220;elevation_40;spread_20`):

![Shadow added to image of lipstick](https://res.cloudinary.com/demo/image/upload/e_dropshadow:azimuth_220;elevation_40;spread_20/docs/rmv_bgd/lipstick-png "with_image:false")

```nodejs
cloudinary.image("docs/rmv_bgd/lipstick-png", {effect: "dropshadow:azimuth_220;elevation_40;spread_20"})
```

```react
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  dropShadow().azimuth(220).elevation(40).spread(20)
);
```

```vue
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  dropShadow().azimuth(220).elevation(40).spread(20)
);
```

```angular
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  dropShadow().azimuth(220).elevation(40).spread(20)
);
```

```js
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  dropShadow().azimuth(220).elevation(40).spread(20)
);
```

```python
CloudinaryImage("docs/rmv_bgd/lipstick-png").image(effect="dropshadow:azimuth_220;elevation_40;spread_20")
```

```php
(new ImageTag('docs/rmv_bgd/lipstick-png'))
	->effect(Effect::dropShadow()->azimuth(220)
->elevation(40)
->spread(20));
```

```java
cloudinary.url().transformation(new Transformation().effect("dropshadow:azimuth_220;elevation_40;spread_20")).imageTag("docs/rmv_bgd/lipstick-png");
```

```ruby
cl_image_tag("docs/rmv_bgd/lipstick-png", effect: "dropshadow:azimuth_220;elevation_40;spread_20")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("dropshadow:azimuth_220;elevation_40;spread_20")).BuildImageTag("docs/rmv_bgd/lipstick-png")
```

```dart
cloudinary.image('docs/rmv_bgd/lipstick-png').transformation(Transformation()
	.effect(Effect.dropShadow().azimuth(220)
.elevation(40)
.spread(20)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("dropshadow:azimuth_220;elevation_40;spread_20")).generate("docs/rmv_bgd/lipstick-png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("dropshadow:azimuth_220;elevation_40;spread_20")).generate("docs/rmv_bgd/lipstick-png");
```

```flutter
cloudinary.image('docs/rmv_bgd/lipstick-png').transformation(Transformation()
	.effect(Effect.dropShadow().azimuth(220)
.elevation(40)
.spread(20)));
```

```kotlin
cloudinary.image {
	publicId("docs/rmv_bgd/lipstick-png")
	 effect(Effect.dropShadow() { azimuth(220)
 elevation(40)
 spread(20) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/rmv_bgd/lipstick-png", {effect: "dropshadow:azimuth_220;elevation_40;spread_20"})
```

```react_native
new CloudinaryImage("docs/rmv_bgd/lipstick-png").effect(
  dropShadow().azimuth(220).elevation(40).spread(20)
);
```

Original

With dropshadow effect

> **NOTES**:
>
> * Either:

>   * the original image must include transparency, for example where the background has already been removed  and it has been stored in a format that supports transparency, such as PNG, or

>   * the `dropshadow` effect must be chained after the [background_removal](transformation_reference#e_background_removal) effect, for example: 
> ![Lipstick with background removed and shadow added](https://res.cloudinary.com/demo/image/upload/e_background_removal/e_dropshadow/docs/lipstick "with_image:false")
> ```nodejs
cloudinary.image("docs/lipstick", {transformation: [
  {effect: "background_removal"},
  {effect: "dropshadow"}
  ]})
```
> ```react
new CloudinaryImage("docs/lipstick")
  .effect(backgroundRemoval())
  .effect(dropShadow());
```
> ```vue
new CloudinaryImage("docs/lipstick")
  .effect(backgroundRemoval())
  .effect(dropShadow());
```
> ```angular
new CloudinaryImage("docs/lipstick")
  .effect(backgroundRemoval())
  .effect(dropShadow());
```
> ```js
new CloudinaryImage("docs/lipstick")
  .effect(backgroundRemoval())
  .effect(dropShadow());
```
> ```python
CloudinaryImage("docs/lipstick").image(transformation=[
  {'effect': "background_removal"},
  {'effect': "dropshadow"}
  ])
```
> ```php
(new ImageTag('docs/lipstick'))
	->effect(Effect::backgroundRemoval())
	->effect(Effect::dropShadow());
```
> ```java
cloudinary.url().transformation(new Transformation()
  .effect("background_removal").chain()
  .effect("dropshadow")).imageTag("docs/lipstick");
```
> ```ruby
cl_image_tag("docs/lipstick", transformation: [
  {effect: "background_removal"},
  {effect: "dropshadow"}
  ])
```
> ```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("background_removal").Chain()
  .Effect("dropshadow")).BuildImageTag("docs/lipstick")
```
> ```dart
cloudinary.image('docs/lipstick').transformation(Transformation()
	.effect(Effect.backgroundRemoval())
	.effect(Effect.dropShadow()));
```
> ```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("background_removal").chain()
  .setEffect("dropshadow")).generate("docs/lipstick")!, cloudinary: cloudinary)
```
> ```android
MediaManager.get().url().transformation(new Transformation()
  .effect("background_removal").chain()
  .effect("dropshadow")).generate("docs/lipstick");
```
> ```flutter
cloudinary.image('docs/lipstick').transformation(Transformation()
	.effect(Effect.backgroundRemoval())
	.effect(Effect.dropShadow()));
```
> ```kotlin
cloudinary.image {
	publicId("docs/lipstick")
	 effect(Effect.backgroundRemoval())
	 effect(Effect.dropShadow()) 
}.generate()
```
> ```jquery
$.cloudinary.image("docs/lipstick", {transformation: [
  {effect: "background_removal"},
  {effect: "dropshadow"}
  ]})
```
> ```react_native
new CloudinaryImage("docs/lipstick")
  .effect(backgroundRemoval())
  .effect(dropShadow());
``` 

> * The dropshadow effect is not supported for [animated](animated_images) images, [fetched](fetch_remote_images#fetch_and_deliver_remote_files) images or [incoming transformations](eager_and_incoming_transformations#incoming_transformations).
See background removal and drop shadow being applied to product images on the fly in a [React app](react_image_transformations#code_explorer_optimization_background_removal_and_drop_shadow).

**See full syntax**: [e_dropshadow](transformation_reference#e_dropshadow) in the _Transformation Reference_.

**Try it out**: [Drop shadow](https://console.cloudinary.com/app/image/home/drop-shadow?media=image&sample=me%2Fjeans&azimuth=135&elevation=20&spread=20).

##### Dropshadow effect demo

Try out the different [dropshadow](transformation_reference#e_dropshadow) effect settings on an image of a bench.

Use the controls to set up the light source, then generate the shadow!

Azimuth (0 to 360): 215

Elevation (0 to 90): 45

Spread (0 to 100): 50

Generate Shadow

May take a few seconds to generate*

 https://res.cloudinary.com/demo/image/upload/e_dropshadow:azimuth_215;elevation_45;spread_50/docs/bench

> **NOTE**: \*It can take a few seconds to generate a new image on the fly if you've tried a combination of settings that hasn't been tried before.  Once an image has been generated though, it's cached on the CDN, so future requests to the same transformation are much faster. You can learn more about that in our [Service introduction](solution_overview#delivery_lifecycle).

### Shape cutouts

You can use a layer image with an opaque shape to either remove that shape from the image below that layer, leaving the shape to be transparent ([e_cut_out](transformation_reference#e_cut_out)), or conversely, use it like a cookie-cutter, to keep only that shape in the base image, and remove the rest ([fl_cutter](transformation_reference#fl_cutter)).

You can also use AI to keep or remove certain parts of an image ([e_extract](transformation_reference#e_extract)).
> **NOTE**: The same [layer transformation syntax](layers#layer_transformation_syntax) rules apply, including for [authenticated or private assets](layers#authenticated_or_private_layers).
#### Remove a shape
The following example uses the `cut_out` effect to cut a `logo` shape (the overlay image) out of a base ruler image.  There's a notebook photo underlay behind the cutout ruler, such that you can see the notebook paper and lines through the logo cutout: 
![Image of a ruler with the Cloudinary logo cut out](https://res.cloudinary.com/demo/image/upload/e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee/docs/10cm_ruler.png "thumb: w_400")

```nodejs
cloudinary.image("docs/10cm_ruler.png", {transformation: [
  {effect: "cut_out", overlay: "docs:logo:logo", gravity: "south_west", width: 200, x: 20, y: 20},
  {underlay: "docs:notebook-coffee"}
  ]})
```

```react
new CloudinaryImage("docs/10cm_ruler.png").addTransformation(
  "e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee"
);
```

```vue
new CloudinaryImage("docs/10cm_ruler.png").addTransformation(
  "e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee"
);
```

```angular
new CloudinaryImage("docs/10cm_ruler.png").addTransformation(
  "e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee"
);
```

```js
new CloudinaryImage("docs/10cm_ruler.png").addTransformation(
  "e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee"
);
```

```python
CloudinaryImage("docs/10cm_ruler.png").image(transformation=[
  {'effect': "cut_out", 'overlay': "docs:logo:logo", 'gravity': "south_west", 'width': 200, 'x': 20, 'y': 20},
  {'underlay': "docs:notebook-coffee"}
  ])
```

```php
(new ImageTag('docs/10cm_ruler.png'))
	->addTransformation("e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee");
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("cut_out").overlay(new Layer().publicId("docs:logo:logo")).gravity("south_west").width(200).x(20).y(20).chain()
  .underlay(new Layer().publicId("docs:notebook-coffee"))).imageTag("docs/10cm_ruler.png");
```

```ruby
cl_image_tag("docs/10cm_ruler.png", transformation: [
  {effect: "cut_out", overlay: "docs:logo:logo", gravity: "south_west", width: 200, x: 20, y: 20},
  {underlay: "docs:notebook-coffee"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("cut_out").Overlay(new Layer().PublicId("docs:logo:logo")).Gravity("south_west").Width(200).X(20).Y(20).Chain()
  .Underlay(new Layer().PublicId("docs:notebook-coffee"))).BuildImageTag("docs/10cm_ruler.png")
```

```dart
cloudinary.image('docs/10cm_ruler.png').transformation(Transformation()
	.addTransformation("e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("cut_out").setOverlay("docs:logo:logo").setGravity("south_west").setWidth(200).setX(20).setY(20).chain()
  .setUnderlay("docs:notebook-coffee")).generate("docs/10cm_ruler.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("cut_out").overlay(new Layer().publicId("docs:logo:logo")).gravity("south_west").width(200).x(20).y(20).chain()
  .underlay(new Layer().publicId("docs:notebook-coffee"))).generate("docs/10cm_ruler.png");
```

```flutter
cloudinary.image('docs/10cm_ruler.png').transformation(Transformation()
	.addTransformation("e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee"));
```

```kotlin
cloudinary.image {
	publicId("docs/10cm_ruler.png")
	 addTransformation("e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee") 
}.generate()
```

```jquery
$.cloudinary.image("docs/10cm_ruler.png", {transformation: [
  {effect: "cut_out", overlay: new cloudinary.Layer().publicId("docs:logo:logo"), gravity: "south_west", width: 200, x: 20, y: 20},
  {underlay: new cloudinary.Layer().publicId("docs:notebook-coffee")}
  ]})
```

```react_native
new CloudinaryImage("docs/10cm_ruler.png").addTransformation(
  "e_cut_out,l_docs:logo:logo,g_south_west,w_200,x_20,y_20/u_docs:notebook-coffee"
);
```

#### Keep a shape

The following example uses the `cutter` flag to trim an image of a water drop based on the shape of a text layer  (`l_text:Unkempt_250_bold:Water/fl_cutter,fl_layer_apply`). The text overlay is defined with the desired font and size of the resulting delivered image: 
    ![Trim an image based on a text overlay definition](https://res.cloudinary.com/demo/image/fetch/f_png/c_scale,w_800/l_text:Unkempt_250_bold:Water/fl_cutter,fl_layer_apply/https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_%281%29.jpg "thumb: w_400")

```nodejs
cloudinary.image("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg", {type: "fetch", transformation: [
  {fetch_format: "png"},
  {width: 800, crop: "scale"},
  {overlay: {font_family: "Unkempt", font_size: 250, font_weight: "bold", text: "Water"}},
  {flags: ["cutter", "layer_apply"]}
  ]})
```

```react
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg"
)
  .delivery(format(png()))
  .resize(scale().width(800))
  .reshape(
    cutByImage(text("Water", new TextStyle("Unkempt", 250).fontWeight("bold")))
  )
  .setDeliveryType("fetch");
```

```vue
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg"
)
  .delivery(format(png()))
  .resize(scale().width(800))
  .reshape(
    cutByImage(text("Water", new TextStyle("Unkempt", 250).fontWeight("bold")))
  )
  .setDeliveryType("fetch");
```

```angular
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg"
)
  .delivery(format(png()))
  .resize(scale().width(800))
  .reshape(
    cutByImage(text("Water", new TextStyle("Unkempt", 250).fontWeight("bold")))
  )
  .setDeliveryType("fetch");
```

```js
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg"
)
  .delivery(format(png()))
  .resize(scale().width(800))
  .reshape(
    cutByImage(text("Water", new TextStyle("Unkempt", 250).fontWeight("bold")))
  )
  .setDeliveryType("fetch");
```

```python
CloudinaryImage("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg").image(type="fetch", transformation=[
  {'fetch_format': "png"},
  {'width': 800, 'crop': "scale"},
  {'overlay': {'font_family': "Unkempt", 'font_size': 250, 'font_weight': "bold", 'text': "Water"}},
  {'flags': ["cutter", "layer_apply"]}
  ])
```

```php
(new ImageTag('https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg'))
	->delivery(Delivery::format(
	Format::png()))
	->resize(Resize::scale()->width(800))
	->reshape(Reshape::cutByImage(
	Source::text("Water",(new TextStyle("Unkempt",250))
	->fontWeight(
	FontWeight::bold())
	)))
	->deliveryType("fetch");
```

```java
cloudinary.url().transformation(new Transformation()
  .fetchFormat("png").chain()
  .width(800).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Unkempt").fontSize(250).fontWeight("bold").text("Water")).chain()
  .flags("cutter", "layer_apply")).type("fetch").imageTag("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg");
```

```ruby
cl_image_tag("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg", type: "fetch", transformation: [
  {fetch_format: "png"},
  {width: 800, crop: "scale"},
  {overlay: {font_family: "Unkempt", font_size: 250, font_weight: "bold", text: "Water"}},
  {flags: ["cutter", "layer_apply"]}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .FetchFormat("png").Chain()
  .Width(800).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Unkempt").FontSize(250).FontWeight("bold").Text("Water")).Chain()
  .Flags("cutter", "layer_apply")).Action("fetch").BuildImageTag("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg")
```

```dart
cloudinary.image('https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg').transformation(Transformation()
	.addTransformation("f_png/c_scale,w_800/l_text:Unkempt_250_bold:Water/fl_cutter,fl_layer_apply")
	.setDeliveryType("fetch"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setType( "fetch").setTransformation(CLDTransformation()
  .setFetchFormat("png").chain()
  .setWidth(800).setCrop("scale").chain()
  .setOverlay("text:Unkempt_250_bold:Water").chain()
  .setFlags("cutter", "layer_apply")).generate("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .fetchFormat("png").chain()
  .width(800).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Unkempt").fontSize(250).fontWeight("bold").text("Water")).chain()
  .flags("cutter", "layer_apply")).type("fetch").generate("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg");
```

```flutter
cloudinary.image('https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg').transformation(Transformation()
	.addTransformation("f_png/c_scale,w_800/l_text:Unkempt_250_bold:Water/fl_cutter,fl_layer_apply")
	.setDeliveryType("fetch"));
```

```kotlin
cloudinary.image {
	publicId("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg")
	 delivery(Delivery.format(
	Format.png()))
	 resize(Resize.scale() { width(800) })
	 reshape(Reshape.cutByImage(
	Source.text("Water",TextStyle("Unkempt",250) {
	 fontWeight(
	FontWeight.bold())
	 })))
	 deliveryType("fetch") 
}.generate()
```

```jquery
$.cloudinary.image("https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg", {type: "fetch", transformation: [
  {fetch_format: "png"},
  {width: 800, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Unkempt").fontSize(250).fontWeight("bold").text("Water")},
  {flags: ["cutter", "layer_apply"]}
  ]})
```

```react_native
new CloudinaryImage(
  "https://upload.wikimedia.org/wikipedia/commons/c/cc/Water_drop_impact_on_a_water-surface_-_(1).jpg"
)
  .delivery(format(png()))
  .resize(scale().width(800))
  .reshape(
    cutByImage(text("Water", new TextStyle("Unkempt", 250).fontWeight("bold")))
  )
  .setDeliveryType("fetch");
```

#### Use AI to determine what to remove or keep in an image

You can use the `e_extract` transformation to specify what to remove or keep in the image using a natural language prompt. 

For example, start with this image of a desk with picture frames:

![A desk with picture frames](https://res.cloudinary.com/demo/image/upload/docs/picture-frames.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/picture-frames.jpg")
```

```react
new CloudinaryImage("docs/picture-frames.jpg");
```

```vue
new CloudinaryImage("docs/picture-frames.jpg");
```

```angular
new CloudinaryImage("docs/picture-frames.jpg");
```

```js
new CloudinaryImage("docs/picture-frames.jpg");
```

```python
CloudinaryImage("docs/picture-frames.jpg").image()
```

```php
(new ImageTag('docs/picture-frames.jpg'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("docs/picture-frames.jpg");
```

```ruby
cl_image_tag("docs/picture-frames.jpg")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("docs/picture-frames.jpg")
```

```dart
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("docs/picture-frames.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("docs/picture-frames.jpg");
```

```flutter
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("docs/picture-frames.jpg") 
}.generate()
```

```jquery
$.cloudinary.image("docs/picture-frames.jpg")
```

```react_native
new CloudinaryImage("docs/picture-frames.jpg");
```

You can extract the picture of the tree (`e_extract:prompt_the%20picture%20of%20the%20tree`):

![The picture of the tree](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20picture%20of%20the%20tree/docs/picture-frames.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/picture-frames.jpg", {effect: "extract:prompt_the picture of the tree"})
```

```react
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree")
);
```

```vue
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree")
);
```

```angular
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree")
);
```

```js
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree")
);
```

```python
CloudinaryImage("docs/picture-frames.jpg").image(effect="extract:prompt_the picture of the tree")
```

```php
(new ImageTag('docs/picture-frames.jpg'))
	->effect(Effect::extract("the picture of the tree"));
```

```java
cloudinary.url().transformation(new Transformation().effect("extract:prompt_the picture of the tree")).imageTag("docs/picture-frames.jpg");
```

```ruby
cl_image_tag("docs/picture-frames.jpg", effect: "extract:prompt_the picture of the tree")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("extract:prompt_the picture of the tree")).BuildImageTag("docs/picture-frames.jpg")
```

```dart
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("extract:prompt_the picture of the tree")).generate("docs/picture-frames.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("extract:prompt_the picture of the tree")).generate("docs/picture-frames.jpg");
```

```flutter
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree")));
```

```kotlin
cloudinary.image {
	publicId("docs/picture-frames.jpg")
	 effect(Effect.extract("the picture of the tree")) 
}.generate()
```

```jquery
$.cloudinary.image("docs/picture-frames.jpg", {effect: "extract:prompt_the picture of the tree"})
```

```react_native
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree")
);
```

Everything but the picture of the tree is now considered background, so you can then [generate a new background](generative_ai_transformations#generative_background_replace) for this picture, let's say an art gallery (`e_gen_background_replace:prompt_an%20art%20gallery`):

![The picture of the tree in an art gallery](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20picture%20of%20the%20tree/e_gen_background_replace:prompt_an%20art%20gallery/docs/picture-frames.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/picture-frames.jpg", {transformation: [
  {effect: "extract:prompt_the picture of the tree"},
  {effect: "gen_background_replace:prompt_an art gallery"}
  ]})
```

```react
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree"))
  .effect(generativeBackgroundReplace().prompt("an art gallery"));
```

```vue
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree"))
  .effect(generativeBackgroundReplace().prompt("an art gallery"));
```

```angular
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree"))
  .effect(generativeBackgroundReplace().prompt("an art gallery"));
```

```js
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree"))
  .effect(generativeBackgroundReplace().prompt("an art gallery"));
```

```python
CloudinaryImage("docs/picture-frames.jpg").image(transformation=[
  {'effect': "extract:prompt_the picture of the tree"},
  {'effect': "gen_background_replace:prompt_an art gallery"}
  ])
```

```php
(new ImageTag('docs/picture-frames.jpg'))
	->effect(Effect::extract("the picture of the tree"))
	->effect(Effect::generativeBackgroundReplace()->prompt("an art gallery"));
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("extract:prompt_the picture of the tree").chain()
  .effect("gen_background_replace:prompt_an art gallery")).imageTag("docs/picture-frames.jpg");
```

```ruby
cl_image_tag("docs/picture-frames.jpg", transformation: [
  {effect: "extract:prompt_the picture of the tree"},
  {effect: "gen_background_replace:prompt_an art gallery"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("extract:prompt_the picture of the tree").Chain()
  .Effect("gen_background_replace:prompt_an art gallery")).BuildImageTag("docs/picture-frames.jpg")
```

```dart
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree"))
	.effect(Effect.generativeBackgroundReplace().prompt("an art gallery")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("extract:prompt_the picture of the tree").chain()
  .setEffect("gen_background_replace:prompt_an art gallery")).generate("docs/picture-frames.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("extract:prompt_the picture of the tree").chain()
  .effect("gen_background_replace:prompt_an art gallery")).generate("docs/picture-frames.jpg");
```

```flutter
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree"))
	.effect(Effect.generativeBackgroundReplace().prompt("an art gallery")));
```

```kotlin
cloudinary.image {
	publicId("docs/picture-frames.jpg")
	 effect(Effect.extract("the picture of the tree"))
	 effect(Effect.generativeBackgroundReplace() { prompt("an art gallery") }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/picture-frames.jpg", {transformation: [
  {effect: "extract:prompt_the picture of the tree"},
  {effect: "gen_background_replace:prompt_an art gallery"}
  ]})
```

```react_native
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree"))
  .effect(generativeBackgroundReplace().prompt("an art gallery"));
```

Or, you can invert the result of the extract transformation (`invert_true`), leaving everything but the picture of the tree:

![Everything but the picture of the tree](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20picture%20of%20the%20tree;invert_true/docs/picture-frames.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/picture-frames.jpg", {effect: "extract:prompt_the picture of the tree;invert_true"})
```

```react
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree").invert()
);
```

```vue
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree").invert()
);
```

```angular
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree").invert()
);
```

```js
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree").invert()
);
```

```python
CloudinaryImage("docs/picture-frames.jpg").image(effect="extract:prompt_the picture of the tree;invert_True")
```

```php
(new ImageTag('docs/picture-frames.jpg'))
	->effect(Effect::extract("the picture of the tree")->invert());
```

```java
cloudinary.url().transformation(new Transformation().effect("extract:prompt_the picture of the tree;invert_true")).imageTag("docs/picture-frames.jpg");
```

```ruby
cl_image_tag("docs/picture-frames.jpg", effect: "extract:prompt_the picture of the tree;invert_true")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("extract:prompt_the picture of the tree;invert_true")).BuildImageTag("docs/picture-frames.jpg")
```

```dart
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree").invert()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("extract:prompt_the picture of the tree;invert_true")).generate("docs/picture-frames.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("extract:prompt_the picture of the tree;invert_true")).generate("docs/picture-frames.jpg");
```

```flutter
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree").invert()));
```

```kotlin
cloudinary.image {
	publicId("docs/picture-frames.jpg")
	 effect(Effect.extract("the picture of the tree") { invert() }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/picture-frames.jpg", {effect: "extract:prompt_the picture of the tree;invert_true"})
```

```react_native
new CloudinaryImage("docs/picture-frames.jpg").effect(
  extract("the picture of the tree").invert()
);
```

And then generate a new picture in that space (`e_gen_background_replace:prompt_a%20sketch%20of%20a%20tree`):

![Picture replaced with a new sketch of a tree](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20picture%20of%20the%20tree;invert_true/e_gen_background_replace:prompt_a%20sketch%20of%20a%20tree/docs/picture-frames.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/picture-frames.jpg", {transformation: [
  {effect: "extract:prompt_the picture of the tree;invert_true"},
  {effect: "gen_background_replace:prompt_a sketch of a tree"}
  ]})
```

```react
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree").invert())
  .effect(generativeBackgroundReplace().prompt("a sketch of a tree"));
```

```vue
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree").invert())
  .effect(generativeBackgroundReplace().prompt("a sketch of a tree"));
```

```angular
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree").invert())
  .effect(generativeBackgroundReplace().prompt("a sketch of a tree"));
```

```js
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree").invert())
  .effect(generativeBackgroundReplace().prompt("a sketch of a tree"));
```

```python
CloudinaryImage("docs/picture-frames.jpg").image(transformation=[
  {'effect': "extract:prompt_the picture of the tree;invert_True"},
  {'effect': "gen_background_replace:prompt_a sketch of a tree"}
  ])
```

```php
(new ImageTag('docs/picture-frames.jpg'))
	->effect(Effect::extract("the picture of the tree")->invert())
	->effect(Effect::generativeBackgroundReplace()->prompt("a sketch of a tree"));
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("extract:prompt_the picture of the tree;invert_true").chain()
  .effect("gen_background_replace:prompt_a sketch of a tree")).imageTag("docs/picture-frames.jpg");
```

```ruby
cl_image_tag("docs/picture-frames.jpg", transformation: [
  {effect: "extract:prompt_the picture of the tree;invert_true"},
  {effect: "gen_background_replace:prompt_a sketch of a tree"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("extract:prompt_the picture of the tree;invert_true").Chain()
  .Effect("gen_background_replace:prompt_a sketch of a tree")).BuildImageTag("docs/picture-frames.jpg")
```

```dart
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree").invert())
	.effect(Effect.generativeBackgroundReplace().prompt("a sketch of a tree")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("extract:prompt_the picture of the tree;invert_true").chain()
  .setEffect("gen_background_replace:prompt_a sketch of a tree")).generate("docs/picture-frames.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("extract:prompt_the picture of the tree;invert_true").chain()
  .effect("gen_background_replace:prompt_a sketch of a tree")).generate("docs/picture-frames.jpg");
```

```flutter
cloudinary.image('docs/picture-frames.jpg').transformation(Transformation()
	.effect(Effect.extract("the picture of the tree").invert())
	.effect(Effect.generativeBackgroundReplace().prompt("a sketch of a tree")));
```

```kotlin
cloudinary.image {
	publicId("docs/picture-frames.jpg")
	 effect(Effect.extract("the picture of the tree") { invert() })
	 effect(Effect.generativeBackgroundReplace() { prompt("a sketch of a tree") }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/picture-frames.jpg", {transformation: [
  {effect: "extract:prompt_the picture of the tree;invert_true"},
  {effect: "gen_background_replace:prompt_a sketch of a tree"}
  ]})
```

```react_native
new CloudinaryImage("docs/picture-frames.jpg")
  .effect(extract("the picture of the tree").invert())
  .effect(generativeBackgroundReplace().prompt("a sketch of a tree"));
```

To use a pre-determined background, you can use the extract effect in a [layer](layers). In this example, the `multiple` parameter is used to extract all the cameras in the image, and overlay them on a colorful background. 

![Cut out cameras and overlay on a colorful background](https://res.cloudinary.com/demo/image/upload/l_docs:old-cameras/e_extract:prompt_camera;multiple_true/fl_layer_apply/c_crop,w_1280,h_831/docs/colorful.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/colorful.jpg", {transformation: [
  {overlay: "docs:old-cameras"},
  {effect: "extract:prompt_camera;multiple_true"},
  {flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ]})
```

```react
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```vue
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```angular
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```js
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```python
CloudinaryImage("docs/colorful.jpg").image(transformation=[
  {'overlay': "docs:old-cameras"},
  {'effect': "extract:prompt_camera;multiple_True"},
  {'flags': "layer_apply"},
  {'width': 1280, 'height': 831, 'crop': "crop"}
  ])
```

```php
(new ImageTag('docs/colorful.jpg'))
	->overlay(Overlay::source(
	Source::image("docs/old-cameras")
	->transformation((new Transformation())
	->effect(Effect::extract("camera")->detectMultiple()))
	))
	->resize(Resize::crop()->width(1280)
->height(831));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:old-cameras")).chain()
  .effect("extract:prompt_camera;multiple_true").chain()
  .flags("layer_apply").chain()
  .width(1280).height(831).crop("crop")).imageTag("docs/colorful.jpg");
```

```ruby
cl_image_tag("docs/colorful.jpg", transformation: [
  {overlay: "docs:old-cameras"},
  {effect: "extract:prompt_camera;multiple_true"},
  {flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("docs:old-cameras")).Chain()
  .Effect("extract:prompt_camera;multiple_true").Chain()
  .Flags("layer_apply").Chain()
  .Width(1280).Height(831).Crop("crop")).BuildImageTag("docs/colorful.jpg")
```

```dart
cloudinary.image('docs/colorful.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/old-cameras")
	.transformation(new Transformation()
	.effect(Effect.extract("camera").detectMultiple()))
	))
	.resize(Resize.crop().width(1280)
.height(831)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("docs:old-cameras").chain()
  .setEffect("extract:prompt_camera;multiple_true").chain()
  .setFlags("layer_apply").chain()
  .setWidth(1280).setHeight(831).setCrop("crop")).generate("docs/colorful.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:old-cameras")).chain()
  .effect("extract:prompt_camera;multiple_true").chain()
  .flags("layer_apply").chain()
  .width(1280).height(831).crop("crop")).generate("docs/colorful.jpg");
```

```flutter
cloudinary.image('docs/colorful.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/old-cameras")
	.transformation(new Transformation()
	.effect(Effect.extract("camera").detectMultiple()))
	))
	.resize(Resize.crop().width(1280)
.height(831)));
```

```kotlin
cloudinary.image {
	publicId("docs/colorful.jpg")
	 overlay(Overlay.source(
	Source.image("docs/old-cameras") {
	 transformation(Transformation {
	 effect(Effect.extract("camera") { detectMultiple() }) })
	 }))
	 resize(Resize.crop() { width(1280)
 height(831) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/colorful.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("docs:old-cameras")},
  {effect: "extract:prompt_camera;multiple_true"},
  {flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ]})
```

```react_native
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

And this is the inverted result:

![Cut out cameras and overlay on a colorful background](https://res.cloudinary.com/demo/image/upload/l_docs:old-cameras/e_extract:prompt_camera;multiple_true;invert_true/fl_layer_apply/c_crop,w_1280,h_831/docs/colorful.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/colorful.jpg", {transformation: [
  {overlay: "docs:old-cameras"},
  {effect: "extract:prompt_camera;multiple_true;invert_true"},
  {flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ]})
```

```react
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple().invert())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```vue
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple().invert())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```angular
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple().invert())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```js
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple().invert())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

```python
CloudinaryImage("docs/colorful.jpg").image(transformation=[
  {'overlay': "docs:old-cameras"},
  {'effect': "extract:prompt_camera;multiple_True;invert_True"},
  {'flags': "layer_apply"},
  {'width': 1280, 'height': 831, 'crop': "crop"}
  ])
```

```php
(new ImageTag('docs/colorful.jpg'))
	->overlay(Overlay::source(
	Source::image("docs/old-cameras")
	->transformation((new Transformation())
	->effect(Effect::extract("camera")->detectMultiple()
->invert()))
	))
	->resize(Resize::crop()->width(1280)
->height(831));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:old-cameras")).chain()
  .effect("extract:prompt_camera;multiple_true;invert_true").chain()
  .flags("layer_apply").chain()
  .width(1280).height(831).crop("crop")).imageTag("docs/colorful.jpg");
```

```ruby
cl_image_tag("docs/colorful.jpg", transformation: [
  {overlay: "docs:old-cameras"},
  {effect: "extract:prompt_camera;multiple_true;invert_true"},
  {flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("docs:old-cameras")).Chain()
  .Effect("extract:prompt_camera;multiple_true;invert_true").Chain()
  .Flags("layer_apply").Chain()
  .Width(1280).Height(831).Crop("crop")).BuildImageTag("docs/colorful.jpg")
```

```dart
cloudinary.image('docs/colorful.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/old-cameras")
	.transformation(new Transformation()
	.effect(Effect.extract("camera").detectMultiple()
.invert()))
	))
	.resize(Resize.crop().width(1280)
.height(831)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("docs:old-cameras").chain()
  .setEffect("extract:prompt_camera;multiple_true;invert_true").chain()
  .setFlags("layer_apply").chain()
  .setWidth(1280).setHeight(831).setCrop("crop")).generate("docs/colorful.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:old-cameras")).chain()
  .effect("extract:prompt_camera;multiple_true;invert_true").chain()
  .flags("layer_apply").chain()
  .width(1280).height(831).crop("crop")).generate("docs/colorful.jpg");
```

```flutter
cloudinary.image('docs/colorful.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/old-cameras")
	.transformation(new Transformation()
	.effect(Effect.extract("camera").detectMultiple()
.invert()))
	))
	.resize(Resize.crop().width(1280)
.height(831)));
```

```kotlin
cloudinary.image {
	publicId("docs/colorful.jpg")
	 overlay(Overlay.source(
	Source.image("docs/old-cameras") {
	 transformation(Transformation {
	 effect(Effect.extract("camera") { detectMultiple()
 invert() }) })
	 }))
	 resize(Resize.crop() { width(1280)
 height(831) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/colorful.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("docs:old-cameras")},
  {effect: "extract:prompt_camera;multiple_true;invert_true"},
  {flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ]})
```

```react_native
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(extract("camera").detectMultiple().invert())
      )
    )
  )
  .resize(crop().width(1280).height(831));
```

Using the extract effect in mask mode, you can achieve interesting results, for example, blend the mask overlay with the colorful image using `e_overlay`:

![Cut out cameras and overlay on a colorful background with overlay masking](https://res.cloudinary.com/demo/image/upload/l_docs:old-cameras/e_extract:prompt_camera;multiple_true;mode_mask/e_overlay,fl_layer_apply/c_crop,w_1280,h_831/docs/colorful.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/colorful.jpg", {transformation: [
  {overlay: "docs:old-cameras"},
  {effect: "extract:prompt_camera;multiple_true;mode_mask"},
  {effect: "overlay", flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ]})
```

```react
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(
          extract("camera").detectMultiple().mode("mask")
        )
      )
    ).blendMode("overlay")
  )
  .resize(crop().width(1280).height(831));
```

```vue
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(
          extract("camera").detectMultiple().mode("mask")
        )
      )
    ).blendMode("overlay")
  )
  .resize(crop().width(1280).height(831));
```

```angular
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(
          extract("camera").detectMultiple().mode("mask")
        )
      )
    ).blendMode("overlay")
  )
  .resize(crop().width(1280).height(831));
```

```js
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(
          extract("camera").detectMultiple().mode("mask")
        )
      )
    ).blendMode("overlay")
  )
  .resize(crop().width(1280).height(831));
```

```python
CloudinaryImage("docs/colorful.jpg").image(transformation=[
  {'overlay': "docs:old-cameras"},
  {'effect': "extract:prompt_camera;multiple_True;mode_mask"},
  {'effect': "overlay", 'flags': "layer_apply"},
  {'width': 1280, 'height': 831, 'crop': "crop"}
  ])
```

```php
(new ImageTag('docs/colorful.jpg'))
	->overlay(Overlay::source(
	Source::image("docs/old-cameras")
	->transformation((new Transformation())
	->effect(Effect::extract("camera")->detectMultiple()
->mode("mask")))
	)
	->blendMode(
	BlendMode::overlay())
	)
	->resize(Resize::crop()->width(1280)
->height(831));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:old-cameras")).chain()
  .effect("extract:prompt_camera;multiple_true;mode_mask").chain()
  .effect("overlay").flags("layer_apply").chain()
  .width(1280).height(831).crop("crop")).imageTag("docs/colorful.jpg");
```

```ruby
cl_image_tag("docs/colorful.jpg", transformation: [
  {overlay: "docs:old-cameras"},
  {effect: "extract:prompt_camera;multiple_true;mode_mask"},
  {effect: "overlay", flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("docs:old-cameras")).Chain()
  .Effect("extract:prompt_camera;multiple_true;mode_mask").Chain()
  .Effect("overlay").Flags("layer_apply").Chain()
  .Width(1280).Height(831).Crop("crop")).BuildImageTag("docs/colorful.jpg")
```

```dart
cloudinary.image('docs/colorful.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/old-cameras")
	.transformation(new Transformation()
	.effect(Effect.extract("camera").detectMultiple()
.mode("mask")))
	)
	.blendMode(
	BlendMode.overlay())
	)
	.resize(Resize.crop().width(1280)
.height(831)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("docs:old-cameras").chain()
  .setEffect("extract:prompt_camera;multiple_true;mode_mask").chain()
  .setEffect("overlay").setFlags("layer_apply").chain()
  .setWidth(1280).setHeight(831).setCrop("crop")).generate("docs/colorful.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:old-cameras")).chain()
  .effect("extract:prompt_camera;multiple_true;mode_mask").chain()
  .effect("overlay").flags("layer_apply").chain()
  .width(1280).height(831).crop("crop")).generate("docs/colorful.jpg");
```

```flutter
cloudinary.image('docs/colorful.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/old-cameras")
	.transformation(new Transformation()
	.effect(Effect.extract("camera").detectMultiple()
.mode("mask")))
	)
	.blendMode(
	BlendMode.overlay())
	)
	.resize(Resize.crop().width(1280)
.height(831)));
```

```kotlin
cloudinary.image {
	publicId("docs/colorful.jpg")
	 overlay(Overlay.source(
	Source.image("docs/old-cameras") {
	 transformation(Transformation {
	 effect(Effect.extract("camera") { detectMultiple()
 mode("mask") }) })
	 }) {
	 blendMode(
	BlendMode.overlay())
	 })
	 resize(Resize.crop() { width(1280)
 height(831) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/colorful.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("docs:old-cameras")},
  {effect: "extract:prompt_camera;multiple_true;mode_mask"},
  {effect: "overlay", flags: "layer_apply"},
  {width: 1280, height: 831, crop: "crop"}
  ]})
```

```react_native
new CloudinaryImage("docs/colorful.jpg")
  .overlay(
    source(
      image("docs/old-cameras").transformation(
        new Transformation().effect(
          extract("camera").detectMultiple().mode("mask")
        )
      )
    ).blendMode("overlay")
  )
  .resize(crop().width(1280).height(831));
```

If your original image has transparency, you can keep the transparency in the output by using the `preserve-alpha` flag. For example, keep the transparent background when extracting the watch dial and inverting the result to keep only the strap:

![Watch strap remaining on a transparent background](https://res.cloudinary.com/demo/image/upload/e_extract:prompt_the%20watch%20dial;invert_true;preserve-alpha_true/docs/wristwatch.png "thumb: h_150")

Then you can achieve an interesting effect by using the extract effect again to keep only the dial and making it semi-transparent (`e_extract:prompt_$prompt/o_30`), then layering the first image, [saved to a variable](user_defined_variables#self_referencing_variables) (`$bracelet_current`), on top of that. You can use a variable for the prompt too so you can easily reuse it (`$prompt_!the%20watch%20dial!`):

![Watch dial made semi-transparent](https://res.cloudinary.com/demo/image/upload/$prompt_!the%20watch%20dial!/e_extract:prompt_$prompt;invert_true;preserve-alpha_true/$bracelet_current/e_extract:prompt_$prompt/o_30/l_$bracelet/fl_layer_apply/docs/wristwatch.png "thumb: h_150")

```nodejs
cloudinary.image("docs/wristwatch.png", {transformation: [
  {variables: [["$prompt", "!the watch dial!"]]},
  {effect: "extract:prompt_$prompt;invert_true;preserve-alpha_true"},
  {variables: [["$bracelet", "current"]]},
  {effect: "extract:prompt_$prompt"},
  {opacity: 30},
  {overlay: "%24bracelet"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("docs/wristwatch.png")
  .addVariable(set("prompt", "the watch dial"))
  .effect(extract().invert().preserveAlpha())
  .addVariable(set("bracelet", expression("current")))
  .effect(extract())
  .adjust(opacity(30))
  .overlay(source(image("$bracelet")));
```

```vue
new CloudinaryImage("docs/wristwatch.png")
  .addVariable(set("prompt", "the watch dial"))
  .effect(extract().invert().preserveAlpha())
  .addVariable(set("bracelet", expression("current")))
  .effect(extract())
  .adjust(opacity(30))
  .overlay(source(image("$bracelet")));
```

```angular
new CloudinaryImage("docs/wristwatch.png")
  .addVariable(set("prompt", "the watch dial"))
  .effect(extract().invert().preserveAlpha())
  .addVariable(set("bracelet", expression("current")))
  .effect(extract())
  .adjust(opacity(30))
  .overlay(source(image("$bracelet")));
```

```js
new CloudinaryImage("docs/wristwatch.png")
  .addVariable(set("prompt", "the watch dial"))
  .effect(extract().invert().preserveAlpha())
  .addVariable(set("bracelet", expression("current")))
  .effect(extract())
  .adjust(opacity(30))
  .overlay(source(image("$bracelet")));
```

```python
CloudinaryImage("docs/wristwatch.png").image(transformation=[
  {'variables': [["$prompt", "!the watch dial!"]]},
  {'effect': "extract:prompt_$prompt;invert_True;preserve-alpha_True"},
  {'variables': [["$bracelet", "current"]]},
  {'effect': "extract:prompt_$prompt"},
  {'opacity': 30},
  {'overlay': "%24bracelet"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('docs/wristwatch.png'))
	->addVariable(Variable::set("prompt","the watch dial"))
	->effect(Effect::extract()->invert()
->preserveAlpha())
	->addVariable(Variable::set("bracelet",
	Expression::expression("current")))
	->effect(Effect::extract())
	->adjust(Adjust::opacity(30))
	->overlay(Overlay::source(
	Source::image("$bracelet")));
```

```java
cloudinary.url().transformation(new Transformation()
  .variables(variable("$prompt","!the watch dial!")).chain()
  .effect("extract:prompt_$prompt;invert_true;preserve-alpha_true").chain()
  .variables(variable("$prompt","!the watch dial!")).variables(variable("$bracelet","current")).chain()
  .effect("extract:prompt_$prompt").chain()
  .opacity(30).chain()
  .overlay(new Layer().publicId("%24bracelet")).chain()
  .flags("layer_apply")).imageTag("docs/wristwatch.png");
```

```ruby
cl_image_tag("docs/wristwatch.png", transformation: [
  {variables: [["$prompt", "!the watch dial!"]]},
  {effect: "extract:prompt_$prompt;invert_true;preserve-alpha_true"},
  {variables: [["$bracelet", "current"]]},
  {effect: "extract:prompt_$prompt"},
  {opacity: 30},
  {overlay: "%24bracelet"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Variables("$prompt", !the watch dial!).Chain()
  .Effect("extract:prompt_$prompt;invert_true;preserve-alpha_true").Chain()
  .Variables("$bracelet", current).Chain()
  .Effect("extract:prompt_$prompt").Chain()
  .Opacity(30).Chain()
  .Overlay(new Layer().PublicId("%24bracelet")).Chain()
  .Flags("layer_apply")).BuildImageTag("docs/wristwatch.png")
```

```dart
cloudinary.image('docs/wristwatch.png').transformation(Transformation()
	.addVariable(Variable.set("prompt","the watch dial"))
	.effect(Effect.extract().invert()
.preserveAlpha())
	.addVariable(Variable.set("bracelet",
	Expression.expression("current")))
	.effect(Effect.extract())
	.adjust(Adjust.opacity(30))
	.overlay(Overlay.source(
	Source.image("$bracelet"))));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .chain()
  .setEffect("extract:prompt_$prompt;invert_true;preserve-alpha_true").chain()
  .chain()
  .setEffect("extract:prompt_$prompt").chain()
  .setOpacity(30).chain()
  .setOverlay("%24bracelet").chain()
  .setFlags("layer_apply")).generate("docs/wristwatch.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .variables(variable("$prompt","!the watch dial!")).chain()
  .effect("extract:prompt_$prompt;invert_true;preserve-alpha_true").chain()
  .variables(variable("$prompt","!the watch dial!")).variables(variable("$bracelet","current")).chain()
  .effect("extract:prompt_$prompt").chain()
  .opacity(30).chain()
  .overlay(new Layer().publicId("%24bracelet")).chain()
  .flags("layer_apply")).generate("docs/wristwatch.png");
```

```flutter
cloudinary.image('docs/wristwatch.png').transformation(Transformation()
	.addVariable(Variable.set("prompt","the watch dial"))
	.effect(Effect.extract().invert()
.preserveAlpha())
	.addVariable(Variable.set("bracelet",
	Expression.expression("current")))
	.effect(Effect.extract())
	.adjust(Adjust.opacity(30))
	.overlay(Overlay.source(
	Source.image("$bracelet"))));
```

```kotlin
cloudinary.image {
	publicId("docs/wristwatch.png")
	 addVariable(Variable.set("prompt","the watch dial"))
	 effect(Effect.extract() { invert()
 preserveAlpha() })
	 addVariable(Variable.set("bracelet",
	Expression.expression("current")))
	 effect(Effect.extract())
	 adjust(Adjust.opacity(30))
	 overlay(Overlay.source(
	Source.image("\$bracelet"))) 
}.generate()
```

```jquery
$.cloudinary.image("docs/wristwatch.png", {transformation: [
  {variables: [["$prompt", "!the watch dial!"]]},
  {effect: "extract:prompt_$prompt;invert_true;preserve-alpha_true"},
  {variables: [["$bracelet", "current"]]},
  {effect: "extract:prompt_$prompt"},
  {opacity: 30},
  {overlay: new cloudinary.Layer().publicId("%24bracelet")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("docs/wristwatch.png")
  .addVariable(set("prompt", "the watch dial"))
  .effect(extract().invert().preserveAlpha())
  .addVariable(set("bracelet", expression("current")))
  .effect(extract())
  .adjust(opacity(30))
  .overlay(source(image("$bracelet")));
```

> **NOTE**:
>
> :title=Notes and limitations:

> * During processing, large images are downscaled to a maximum of 2048 x 2048 pixels, then upscaled back to their original size, which may affect quality.

> * This transformation changes the image's visual appearance by adjusting only the alpha channel, which controls transparency. The underlying RGB channel data remains unchanged and fully preserved, even in areas that become fully transparent.

> * When you specify more than one prompt, all the objects specified in each of the prompts will be extracted whether or not `multiple_true` is specified in the URL.

> * There is a [special transformation count](transformation_counts#special_effect_calculations) for the extract effect.

> * The extract effect is not supported for [animated](animated_images) images, [fetched](fetch_remote_images#fetch_and_deliver_remote_files) images or [incoming transformations](eager_and_incoming_transformations#incoming_transformations).

> * [User-defined variables](user_defined_variables) cannot be used for the prompt when more than one prompt is specified.

> * When Cloudinary is generating a derived version, you may get a 423 response returned until the version is ready. You can prepare derived versions in advance using an [eager transformation](eager_and_incoming_transformations#eager_transformations).

> * When Cloudinary is generating an [incoming transformation](eager_and_incoming_transformations#incoming_transformations), you may get a 420 response returned, with status `pending` until the asset is ready.

> * If you're using our [Asia Pacific data center](admin_api#alternative_data_centers_and_endpoints_premium_feature), you currently can't apply the extract effect.
**See full syntax**: [e_extract](transformation_reference#e_extract) in the _Transformation Reference_.

**Try it out**: [Content extraction](https://console.cloudinary.com/app/image/home/content-extraction?media=image&collection=collection&sample=me%2Fflatlay.jpg&prompts=camera,glasses,plant&detectMultiple=false&returnMask=false&invert=false).

### Theme
Use the `theme` effect to change the color theme of a screen capture, either to match or contrast with your own website. The effect applies an algorithm that intelligently adjusts the color of illustrations, such as backgrounds, designs, texts, and logos, while keeping photographic elements in their original colors. If needed, luma gets reversed (so if the original has dark text on a bright background, and the target background is dark, the text becomes bright).

In the example below, a screen capture with a predominantly light theme is converted to a dark theme by specifying black as the target background color:

![Screen capture of the Cloudinary website](https://res.cloudinary.com/demo/image/upload/docs/cloudinary_website.png  "thumb: w_400,dpr_2,f_auto,q_auto, with_code:false, with_url:false, width:400")

![Screen capture of the Cloudinary website](https://res.cloudinary.com/demo/image/upload/e_theme:color_black:photosensitivity_110/docs/cloudinary_website.png "thumb: w_400,dpr_2,f_auto,q_auto, width:400")

```nodejs
cloudinary.image("docs/cloudinary_website.png", {effect: "theme:color_black:photosensitivity_110"})
```

```react
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```vue
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```angular
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```js
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```python
CloudinaryImage("docs/cloudinary_website.png").image(effect="theme:color_black:photosensitivity_110")
```

```php
(new ImageTag('docs/cloudinary_website.png'))
	->addTransformation("e_theme:color_black:photosensitivity_110");
```

```java
cloudinary.url().transformation(new Transformation().effect("theme:color_black:photosensitivity_110")).imageTag("docs/cloudinary_website.png");
```

```ruby
cl_image_tag("docs/cloudinary_website.png", effect: "theme:color_black:photosensitivity_110")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("theme:color_black:photosensitivity_110")).BuildImageTag("docs/cloudinary_website.png")
```

```dart
cloudinary.image('docs/cloudinary_website.png').transformation(Transformation()
	.addTransformation("e_theme:color_black:photosensitivity_110"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("theme:color_black:photosensitivity_110")).generate("docs/cloudinary_website.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("theme:color_black:photosensitivity_110")).generate("docs/cloudinary_website.png");
```

```flutter
cloudinary.image('docs/cloudinary_website.png').transformation(Transformation()
	.addTransformation("e_theme:color_black:photosensitivity_110"));
```

```kotlin
cloudinary.image {
	publicId("docs/cloudinary_website.png")
	 addTransformation("e_theme:color_black:photosensitivity_110") 
}.generate()
```

```jquery
$.cloudinary.image("docs/cloudinary_website.png", {effect: "theme:color_black:photosensitivity_110"})
```

```react_native
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

**See full syntax**: [e_theme](transformation_reference#e_theme) in the _Transformation Reference_.

### Tint

The `tint:<options>` effect enables you to blend your images with one or more colors and specify the blend strength. Advanced users can also equalize the image for increased contrast and specify the positioning of the gradient blend for each color.

* By default, `e_tint` applies a red color at 60% blend strength. 

* Specify the colors and blend strength amount in the format: 

        e_tint:[amount]:[color1]:[color2]:...:[color10].

    `amount` is a value from 0-100, where 0 keeps the original color and 100 blends the specified colors completely. 

    The `color` can be specified as an RGB hex triplet (e.g., rgb:3e2222), a 3-digit RGB hex (e.g., rgb:777) or a named color (e.g., green).
    
    For example:  

    ![multi-color tinting at 100% strength](https://res.cloudinary.com/demo/image/upload/e_tint:100:red:blue:yellow/greece_landscape.jpg "with_image:false")

```nodejs
cloudinary.image("greece_landscape.jpg", {effect: "tint:100:red:blue:yellow"})
```

```react
new CloudinaryImage("greece_landscape.jpg").adjust(tint("100:red:blue:yellow"));
```

```vue
new CloudinaryImage("greece_landscape.jpg").adjust(tint("100:red:blue:yellow"));
```

```angular
new CloudinaryImage("greece_landscape.jpg").adjust(tint("100:red:blue:yellow"));
```

```js
new CloudinaryImage("greece_landscape.jpg").adjust(tint("100:red:blue:yellow"));
```

```python
CloudinaryImage("greece_landscape.jpg").image(effect="tint:100:red:blue:yellow")
```

```php
(new ImageTag('greece_landscape.jpg'))
	->adjust(Adjust::tint("100:red:blue:yellow"));
```

```java
cloudinary.url().transformation(new Transformation().effect("tint:100:red:blue:yellow")).imageTag("greece_landscape.jpg");
```

```ruby
cl_image_tag("greece_landscape.jpg", effect: "tint:100:red:blue:yellow")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("tint:100:red:blue:yellow")).BuildImageTag("greece_landscape.jpg")
```

```dart
cloudinary.image('greece_landscape.jpg').transformation(Transformation()
	.adjust(Adjust.tint("100:red:blue:yellow")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("tint:100:red:blue:yellow")).generate("greece_landscape.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("tint:100:red:blue:yellow")).generate("greece_landscape.jpg");
```

```flutter
cloudinary.image('greece_landscape.jpg').transformation(Transformation()
	.adjust(Adjust.tint("100:red:blue:yellow")));
```

```kotlin
cloudinary.image {
	publicId("greece_landscape.jpg")
	 adjust(Adjust.tint("100:red:blue:yellow")) 
}.generate()
```

```jquery
$.cloudinary.image("greece_landscape.jpg", {effect: "tint:100:red:blue:yellow"})
```

```react_native
new CloudinaryImage("greece_landscape.jpg").adjust(tint("100:red:blue:yellow"));
```

* To [equalize](#equalize) the colors in your image before tinting, set `equalize` to true (false by default). For example:
  
    ![multi-color tinting at 100% strength](https://res.cloudinary.com/demo/image/upload/e_tint:equalize:80:red:blue:yellow/greece_landscape.jpg "with_image:false")

```nodejs
cloudinary.image("greece_landscape.jpg", {effect: "tint:equalize:80:red:blue:yellow"})
```

```react
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:blue:yellow")
);
```

```vue
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:blue:yellow")
);
```

```angular
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:blue:yellow")
);
```

```js
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:blue:yellow")
);
```

```python
CloudinaryImage("greece_landscape.jpg").image(effect="tint:equalize:80:red:blue:yellow")
```

```php
(new ImageTag('greece_landscape.jpg'))
	->adjust(Adjust::tint("equalize:80:red:blue:yellow"));
```

```java
cloudinary.url().transformation(new Transformation().effect("tint:equalize:80:red:blue:yellow")).imageTag("greece_landscape.jpg");
```

```ruby
cl_image_tag("greece_landscape.jpg", effect: "tint:equalize:80:red:blue:yellow")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("tint:equalize:80:red:blue:yellow")).BuildImageTag("greece_landscape.jpg")
```

```dart
cloudinary.image('greece_landscape.jpg').transformation(Transformation()
	.adjust(Adjust.tint("equalize:80:red:blue:yellow")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("tint:equalize:80:red:blue:yellow")).generate("greece_landscape.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("tint:equalize:80:red:blue:yellow")).generate("greece_landscape.jpg");
```

```flutter
cloudinary.image('greece_landscape.jpg').transformation(Transformation()
	.adjust(Adjust.tint("equalize:80:red:blue:yellow")));
```

```kotlin
cloudinary.image {
	publicId("greece_landscape.jpg")
	 adjust(Adjust.tint("equalize:80:red:blue:yellow")) 
}.generate()
```

```jquery
$.cloudinary.image("greece_landscape.jpg", {effect: "tint:equalize:80:red:blue:yellow"})
```

```react_native
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:blue:yellow")
);
```

* By default, the specified colors are distributed evenly. To adjust the positioning of the gradient blend, specify a `position` value between 0p-100p. If specifying positioning, you must specify a position value for all colors. For example:

    ![multi-color tinting at 100% strength](https://res.cloudinary.com/demo/image/upload/e_tint:equalize:80:red:50p:blue:60p:yellow:40p/greece_landscape.jpg "with_image:false")

```nodejs
cloudinary.image("greece_landscape.jpg", {effect: "tint:equalize:80:red:50p:blue:60p:yellow:40p"})
```

```react
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:50p:blue:60p:yellow:40p")
);
```

```vue
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:50p:blue:60p:yellow:40p")
);
```

```angular
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:50p:blue:60p:yellow:40p")
);
```

```js
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:50p:blue:60p:yellow:40p")
);
```

```python
CloudinaryImage("greece_landscape.jpg").image(effect="tint:equalize:80:red:50p:blue:60p:yellow:40p")
```

```php
(new ImageTag('greece_landscape.jpg'))
	->adjust(Adjust::tint("equalize:80:red:50p:blue:60p:yellow:40p"));
```

```java
cloudinary.url().transformation(new Transformation().effect("tint:equalize:80:red:50p:blue:60p:yellow:40p")).imageTag("greece_landscape.jpg");
```

```ruby
cl_image_tag("greece_landscape.jpg", effect: "tint:equalize:80:red:50p:blue:60p:yellow:40p")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("tint:equalize:80:red:50p:blue:60p:yellow:40p")).BuildImageTag("greece_landscape.jpg")
```

```dart
cloudinary.image('greece_landscape.jpg').transformation(Transformation()
	.adjust(Adjust.tint("equalize:80:red:50p:blue:60p:yellow:40p")));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("tint:equalize:80:red:50p:blue:60p:yellow:40p")).generate("greece_landscape.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("tint:equalize:80:red:50p:blue:60p:yellow:40p")).generate("greece_landscape.jpg");
```

```flutter
cloudinary.image('greece_landscape.jpg').transformation(Transformation()
	.adjust(Adjust.tint("equalize:80:red:50p:blue:60p:yellow:40p")));
```

```kotlin
cloudinary.image {
	publicId("greece_landscape.jpg")
	 adjust(Adjust.tint("equalize:80:red:50p:blue:60p:yellow:40p")) 
}.generate()
```

```jquery
$.cloudinary.image("greece_landscape.jpg", {effect: "tint:equalize:80:red:50p:blue:60p:yellow:40p"})
```

```react_native
new CloudinaryImage("greece_landscape.jpg").adjust(
  tint("equalize:80:red:50p:blue:60p:yellow:40p")
);
```

Original 

default red color at 20% strength

red, blue, yellow  at 100% strength

equalized, mutli-color, 80%, adjusted gradients

 

1**Equalizing** colors redistributes the pixels in your image so that they are equally balanced across the entire range of brightness values, which increases the overall contrast in the image. The lightest area is remapped to pure white, and the darkest area is remapped to pure black.

**See full syntax**: [e_tint](transformation_reference#e_tint) in the _Transformation Reference_.

### Vectorize

The `vectorize` effect (`e_vectorize` in URLs) can be used to convert a raster image to a vector format such as SVG. This can be useful for a variety of use cases, such as:

* Converting a logo graphic in PNG format to an SVG, allowing the graphic to scale as required.
* Creating a low quality image placeholder that resembles the original image but with a reduced number of colors and lower file-size.
* Vectorizing as an artistic effect.

The vectorize effect can also be controlled with additional parameters to fine tune it to your use case.

**See full syntax** : [e_vectorize](transformation_reference#e_vectorize) in the *Transformation Reference*.

Below you can see a variety of potential outputs using these options. The top-left image is the original photo. Following it, you can see the vector graphics, output as JPG, with varying levels of detail, color, despeckling and more. Click each image to open in a new tab and see the full transformation.

  &nbsp;

  &nbsp;

  &nbsp;

  &nbsp;

  &nbsp;

  &nbsp;

#### Converting a logo PNG to SVG

If you have a logo or graphic as a raster image such as a PNG that you need to scale up or deliver in a more compact form, you can use the vectorize effect to create an SVG version that matches the original as closely as possible.

The original racoon PNG below is 256px wide and 28kb.

![Original racoon logo png](https://res.cloudinary.com/demo/image/upload/docs/racoon.png "with_code: false, with_url:false")

If you want to display this image at a larger size, it will become blurry and the file size will increase with the resolution, as you can see in the below example which is twice the size of the original.

![Upscaled PNG x4](https://res.cloudinary.com/demo/image/upload/c_scale,w_2.0/docs/racoon.png "with_code: false, with_url:false")

To avoid the issues above, it's much better to deliver a vector image for this graphic using the `vectorize` effect. 
The example below delivers an SVG at the maximum detail (1.0) with 3 colors (like the original) and an intermediate value of 40 for the corners. This yields an extremely compact, 8 KB file that will provide pixel-perfect scaling to any size.

![Deliver PNG as vectorized SVG](https://res.cloudinary.com/demo/image/upload/e_vectorize:colors:3:corners:40:detail:1.0/docs/racoon.png)

```nodejs
cloudinary.image("docs/racoon.png", {effect: "vectorize:colors:3:corners:40:detail:1.0"})
```

```react
new CloudinaryImage("docs/racoon.png").effect(
  vectorize().numOfColors(3).detailsLevel("1.0").cornersLevel(40)
);
```

```vue
new CloudinaryImage("docs/racoon.png").effect(
  vectorize().numOfColors(3).detailsLevel("1.0").cornersLevel(40)
);
```

```angular
new CloudinaryImage("docs/racoon.png").effect(
  vectorize().numOfColors(3).detailsLevel("1.0").cornersLevel(40)
);
```

```js
new CloudinaryImage("docs/racoon.png").effect(
  vectorize().numOfColors(3).detailsLevel("1.0").cornersLevel(40)
);
```

```python
CloudinaryImage("docs/racoon.png").image(effect="vectorize:colors:3:corners:40:detail:1.0")
```

```php
(new ImageTag('docs/racoon.png'))
	->effect(Effect::vectorize()->numOfColors(3)
->detailsLevel(1.0)
->cornersLevel(40));
```

```java
cloudinary.url().transformation(new Transformation().effect("vectorize:colors:3:corners:40:detail:1.0")).imageTag("docs/racoon.png");
```

```ruby
cl_image_tag("docs/racoon.png", effect: "vectorize:colors:3:corners:40:detail:1.0")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("vectorize:colors:3:corners:40:detail:1.0")).BuildImageTag("docs/racoon.png")
```

```dart
cloudinary.image('docs/racoon.png').transformation(Transformation()
	.effect(Effect.vectorize().numOfColors(3)
.detailsLevel('1.0')
.cornersLevel(40)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("vectorize:colors:3:corners:40:detail:1.0")).generate("docs/racoon.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("vectorize:colors:3:corners:40:detail:1.0")).generate("docs/racoon.png");
```

```flutter
cloudinary.image('docs/racoon.png').transformation(Transformation()
	.effect(Effect.vectorize().numOfColors(3)
.detailsLevel('1.0')
.cornersLevel(40)));
```

```kotlin
cloudinary.image {
	publicId("docs/racoon.png")
	 effect(Effect.vectorize() { numOfColors(3)
 detailsLevel(1.0F)
 cornersLevel(40) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/racoon.png", {effect: "vectorize:colors:3:corners:40:detail:1.0"})
```

```react_native
new CloudinaryImage("docs/racoon.png").effect(
  vectorize().numOfColors(3).detailsLevel("1.0").cornersLevel(40)
);
``` 

#### Creating a low quality image placeholder SVG

When delivering high quality photos, it's good web design practice to first deliver Low Quality Image Placeholders (LQIPs) that are very compact in size, and load extremely quickly. Cloudinary supports a large variety of compressions that can potentially be used for generating placeholders. You can read some more about those [here](https://cloudinary.com/blog/low_quality_image_placeholders_lqip_explained).

Using SVGs is a nice way to display a placeholder. As an example, the lion jpeg image below with Cloudinary's optimizations applied, still gets delivered at **397 KB**.

![full resolution lion](https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/docs/lion.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/lion.jpg", {quality: "auto", fetch_format: "auto"})
```

```react
new CloudinaryImage("docs/lion.jpg")
  .delivery(format(auto()))
  .delivery(quality(auto()));
```

```vue
new CloudinaryImage("docs/lion.jpg")
  .delivery(format(auto()))
  .delivery(quality(auto()));
```

```angular
new CloudinaryImage("docs/lion.jpg")
  .delivery(format(auto()))
  .delivery(quality(auto()));
```

```js
new CloudinaryImage("docs/lion.jpg")
  .delivery(format(auto()))
  .delivery(quality(auto()));
```

```python
CloudinaryImage("docs/lion.jpg").image(quality="auto", fetch_format="auto")
```

```php
(new ImageTag('docs/lion.jpg'))
	->delivery(Delivery::format(
	Format::auto()))
	->delivery(Delivery::quality(
	Quality::auto()));
```

```java
cloudinary.url().transformation(new Transformation().quality("auto").fetchFormat("auto")).imageTag("docs/lion.jpg");
```

```ruby
cl_image_tag("docs/lion.jpg", quality: "auto", fetch_format: "auto")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Quality("auto").FetchFormat("auto")).BuildImageTag("docs/lion.jpg")
```

```dart
cloudinary.image('docs/lion.jpg').transformation(Transformation()
	.delivery(Delivery.format(
	Format.auto()))
	.delivery(Delivery.quality(
	Quality.auto())));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setQuality("auto").setFetchFormat("auto")).generate("docs/lion.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().quality("auto").fetchFormat("auto")).generate("docs/lion.jpg");
```

```flutter
cloudinary.image('docs/lion.jpg').transformation(Transformation()
	.delivery(Delivery.format(
	Format.auto()))
	.delivery(Delivery.quality(
	Quality.auto())));
```

```kotlin
cloudinary.image {
	publicId("docs/lion.jpg")
	 delivery(Delivery.format(
	Format.auto()))
	 delivery(Delivery.quality(
	Quality.auto())) 
}.generate()
```

```jquery
$.cloudinary.image("docs/lion.jpg", {quality: "auto", fetch_format: "auto"})
```

```react_native
new CloudinaryImage("docs/lion.jpg")
  .delivery(format(auto()))
  .delivery(quality(auto()));
```

Instead, an SVG LQIP can be used while lazy loading the full-sized image.

The placeholder should still represent the subject matter of the original but also be very compact. Confining the SVG to 2 colors and a detail level of 5% produces an easily identifiable image with a file size of just **6 KB**.

![LQIP lion](https://res.cloudinary.com/demo/image/upload/e_vectorize:colors:2:detail:0.05/docs/lion.svg "thumb: w_400")

```nodejs
cloudinary.image("docs/lion.svg", {effect: "vectorize:colors:2:detail:0.05"})
```

```react
new CloudinaryImage("docs/lion.svg").effect(
  vectorize().numOfColors(2).detailsLevel(0.05)
);
```

```vue
new CloudinaryImage("docs/lion.svg").effect(
  vectorize().numOfColors(2).detailsLevel(0.05)
);
```

```angular
new CloudinaryImage("docs/lion.svg").effect(
  vectorize().numOfColors(2).detailsLevel(0.05)
);
```

```js
new CloudinaryImage("docs/lion.svg").effect(
  vectorize().numOfColors(2).detailsLevel(0.05)
);
```

```python
CloudinaryImage("docs/lion.svg").image(effect="vectorize:colors:2:detail:0.05")
```

```php
(new ImageTag('docs/lion.svg'))
	->effect(Effect::vectorize()->numOfColors(2)
->detailsLevel(0.05));
```

```java
cloudinary.url().transformation(new Transformation().effect("vectorize:colors:2:detail:0.05")).imageTag("docs/lion.svg");
```

```ruby
cl_image_tag("docs/lion.svg", effect: "vectorize:colors:2:detail:0.05")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("vectorize:colors:2:detail:0.05")).BuildImageTag("docs/lion.svg")
```

```dart
cloudinary.image('docs/lion.svg').transformation(Transformation()
	.effect(Effect.vectorize().numOfColors(2)
.detailsLevel(0.05)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("vectorize:colors:2:detail:0.05")).generate("docs/lion.svg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("vectorize:colors:2:detail:0.05")).generate("docs/lion.svg");
```

```flutter
cloudinary.image('docs/lion.svg').transformation(Transformation()
	.effect(Effect.vectorize().numOfColors(2)
.detailsLevel(0.05)));
```

```kotlin
cloudinary.image {
	publicId("docs/lion.svg")
	 effect(Effect.vectorize() { numOfColors(2)
 detailsLevel(0.05F) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/lion.svg", {effect: "vectorize:colors:2:detail:0.05"})
```

```react_native
new CloudinaryImage("docs/lion.svg").effect(
  vectorize().numOfColors(2).detailsLevel(0.05)
);
```

#### Vectorizing as an artistic effect

Vectorizing is a great way to capture the main shapes and objects composing a photo or drawing and also produces a nice effect. When using the vectorize effect for an artistic transformation, you can deliver the vectorized images in any format, simply by specifying the relevant extension.

For example, the image of a fruit stand below has been vectorized to create a nice artistic effect and subsequently delivered as an optimized jpg file.

![fruit stand vectorized](https://res.cloudinary.com/demo/image/upload/q_auto,e_vectorize/docs/fruit-stand.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/fruit-stand.jpg", {quality: "auto", effect: "vectorize"})
```

```react
new CloudinaryImage("docs/fruit-stand.jpg")
  .effect(vectorize())
  .delivery(quality(auto()));
```

```vue
new CloudinaryImage("docs/fruit-stand.jpg")
  .effect(vectorize())
  .delivery(quality(auto()));
```

```angular
new CloudinaryImage("docs/fruit-stand.jpg")
  .effect(vectorize())
  .delivery(quality(auto()));
```

```js
new CloudinaryImage("docs/fruit-stand.jpg")
  .effect(vectorize())
  .delivery(quality(auto()));
```

```python
CloudinaryImage("docs/fruit-stand.jpg").image(quality="auto", effect="vectorize")
```

```php
(new ImageTag('docs/fruit-stand.jpg'))
	->effect(Effect::vectorize())
	->delivery(Delivery::quality(
	Quality::auto()));
```

```java
cloudinary.url().transformation(new Transformation().quality("auto").effect("vectorize")).imageTag("docs/fruit-stand.jpg");
```

```ruby
cl_image_tag("docs/fruit-stand.jpg", quality: "auto", effect: "vectorize")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Quality("auto").Effect("vectorize")).BuildImageTag("docs/fruit-stand.jpg")
```

```dart
cloudinary.image('docs/fruit-stand.jpg').transformation(Transformation()
	.effect(Effect.vectorize())
	.delivery(Delivery.quality(
	Quality.auto())));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setQuality("auto").setEffect("vectorize")).generate("docs/fruit-stand.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().quality("auto").effect("vectorize")).generate("docs/fruit-stand.jpg");
```

```flutter
cloudinary.image('docs/fruit-stand.jpg').transformation(Transformation()
	.effect(Effect.vectorize())
	.delivery(Delivery.quality(
	Quality.auto())));
```

```kotlin
cloudinary.image {
	publicId("docs/fruit-stand.jpg")
	 effect(Effect.vectorize())
	 delivery(Delivery.quality(
	Quality.auto())) 
}.generate()
```

```jquery
$.cloudinary.image("docs/fruit-stand.jpg", {quality: "auto", effect: "vectorize"})
```

```react_native
new CloudinaryImage("docs/fruit-stand.jpg")
  .effect(vectorize())
  .delivery(quality(auto()));
```

### Zoompan

Use the [zoompan](transformation_reference#e_zoompan) effect to apply zooming and/or panning to an image, resulting in an animated image.

> **NOTE**: You need to transform the original image to an animated image type by either changing the [extension](transformation_reference#_lt_extension_gt) or using the [format](transformation_reference#f_format) parameter.

For example, you could take this image of a hotel and pool:

![Hotel and swimming pool](https://res.cloudinary.com/demo/image/upload/docs/hotel-pool.jpg "with_url:false, with_code:false, thumb:c_scale,w_350")

...and create an animated version of it that starts zoomed into the right-hand side, and slowly pans out to the left while zooming out:

![Hotel and swimming pool with zoompan effect](https://res.cloudinary.com/demo/image/upload/e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop/docs/hotel-pool.gif "thumb: w_350")

```nodejs
cloudinary.image("docs/hotel-pool.gif", {transformation: [
  {effect: "zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30"},
  {effect: "loop"}
  ]})
```

```react
new CloudinaryImage("docs/hotel-pool.gif").addTransformation(
  "e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop"
);
```

```vue
new CloudinaryImage("docs/hotel-pool.gif").addTransformation(
  "e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop"
);
```

```angular
new CloudinaryImage("docs/hotel-pool.gif").addTransformation(
  "e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop"
);
```

```js
new CloudinaryImage("docs/hotel-pool.gif").addTransformation(
  "e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop"
);
```

```python
CloudinaryImage("docs/hotel-pool.gif").image(transformation=[
  {'effect': "zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30"},
  {'effect': "loop"}
  ])
```

```php
(new ImageTag('docs/hotel-pool.gif'))
	->addTransformation("e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop");
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30").chain()
  .effect("loop")).imageTag("docs/hotel-pool.gif");
```

```ruby
cl_image_tag("docs/hotel-pool.gif", transformation: [
  {effect: "zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30"},
  {effect: "loop"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Effect("zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30").Chain()
  .Effect("loop")).BuildImageTag("docs/hotel-pool.gif")
```

```dart
cloudinary.image('docs/hotel-pool.gif').transformation(Transformation()
	.addTransformation("e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setEffect("zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30").chain()
  .setEffect("loop")).generate("docs/hotel-pool.gif")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30").chain()
  .effect("loop")).generate("docs/hotel-pool.gif");
```

```flutter
cloudinary.image('docs/hotel-pool.gif').transformation(Transformation()
	.addTransformation("e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop"));
```

```kotlin
cloudinary.image {
	publicId("docs/hotel-pool.gif")
	 addTransformation("e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop") 
}.generate()
```

```jquery
$.cloudinary.image("docs/hotel-pool.gif", {transformation: [
  {effect: "zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30"},
  {effect: "loop"}
  ]})
```

```react_native
new CloudinaryImage("docs/hotel-pool.gif").addTransformation(
  "e_zoompan:mode_ofr;maxzoom_4.2;du_9;fps_30/e_loop"
);
```

Or, you can specify custom co-ordinates for the start and end positions, for example start from a position in the northwest of the USA map (x=300, y=100 pixels), and zoom into North Carolina at (x=950, y=400 pixels).

![Map of the USA with zoompan effect](https://res.cloudinary.com/demo/image/upload/e_zoompan:from_(zoom_2;x_300;y_100)

```nodejs
cloudinary.image("e_zoompan:from_(zoom_2;x_300;y_100")
```

```react
new CloudinaryImage("e_zoompan:from_(zoom_2;x_300;y_100");
```

```vue
new CloudinaryImage("e_zoompan:from_(zoom_2;x_300;y_100");
```

```angular
new CloudinaryImage("e_zoompan:from_(zoom_2;x_300;y_100");
```

```js
new CloudinaryImage("e_zoompan:from_(zoom_2;x_300;y_100");
```

```python
CloudinaryImage("e_zoompan:from_(zoom_2;x_300;y_100").image()
```

```php
(new ImageTag('e_zoompan:from_(zoom_2;x_300;y_100'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("e_zoompan:from_(zoom_2;x_300;y_100");
```

```ruby
cl_image_tag("e_zoompan:from_(zoom_2;x_300;y_100")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("e_zoompan:from_(zoom_2;x_300;y_100")
```

```dart
cloudinary.image('e_zoompan:from_(zoom_2;x_300;y_100').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("e_zoompan:from_(zoom_2;x_300;y_100")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("e_zoompan:from_(zoom_2;x_300;y_100");
```

```flutter
cloudinary.image('e_zoompan:from_(zoom_2;x_300;y_100').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("e_zoompan:from_(zoom_2;x_300;y_100") 
}.generate()
```

```jquery
$.cloudinary.image("e_zoompan:from_(zoom_2;x_300;y_100")
```

```react_native
new CloudinaryImage("e_zoompan:from_(zoom_2;x_300;y_100");
```;to_(zoom_4;x_950;y_400);du_8;fps_30/e_loop/docs/usa_map.gif "thumb: w_400")

If you want to automate the `zoompan` effect for any image, you can use automatic gravity (`g_auto` in URLs) to zoom into or out of the area of the image which Cloudinary determines to be most interesting.  In the following example, the man's face is determined to be the most interesting area of the image, so the zoom starts from there when specifying `from_(g_auto;zoom_3.4)`:

![Man playing guitar with zoompan effect](https://res.cloudinary.com/demo/image/upload/e_zoompan:du_6;from_(g_auto;zoom_3.4)

```nodejs
cloudinary.image("e_zoompan:du_6;from_(g_auto;zoom_3.4")
```

```react
new CloudinaryImage("e_zoompan:du_6;from_(g_auto;zoom_3.4");
```

```vue
new CloudinaryImage("e_zoompan:du_6;from_(g_auto;zoom_3.4");
```

```angular
new CloudinaryImage("e_zoompan:du_6;from_(g_auto;zoom_3.4");
```

```js
new CloudinaryImage("e_zoompan:du_6;from_(g_auto;zoom_3.4");
```

```python
CloudinaryImage("e_zoompan:du_6;from_(g_auto;zoom_3.4").image()
```

```php
(new ImageTag('e_zoompan:du_6;from_(g_auto;zoom_3.4'));
```

```java
cloudinary.url().transformation(new Transformation().imageTag("e_zoompan:du_6;from_(g_auto;zoom_3.4");
```

```ruby
cl_image_tag("e_zoompan:du_6;from_(g_auto;zoom_3.4")
```

```csharp
cloudinary.Api.UrlImgUp.BuildImageTag("e_zoompan:du_6;from_(g_auto;zoom_3.4")
```

```dart
cloudinary.image('e_zoompan:du_6;from_(g_auto;zoom_3.4').transformation(Transformation());
```

```swift
imageView.cldSetImage(cloudinary.createUrl().generate("e_zoompan:du_6;from_(g_auto;zoom_3.4")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().generate("e_zoompan:du_6;from_(g_auto;zoom_3.4");
```

```flutter
cloudinary.image('e_zoompan:du_6;from_(g_auto;zoom_3.4').transformation(Transformation());
```

```kotlin
cloudinary.image {
	publicId("e_zoompan:du_6;from_(g_auto;zoom_3.4") 
}.generate()
```

```jquery
$.cloudinary.image("e_zoompan:du_6;from_(g_auto;zoom_3.4")
```

```react_native
new CloudinaryImage("e_zoompan:du_6;from_(g_auto;zoom_3.4");
```/e_loop/docs/guitar-man.gif "thumb: w_300")

There are many different ways to apply zooming and panning to your images. You can apply different levels of zoom, duration and frame rate and you can even choose objects to pan between. 

**See full syntax**: [e_zoompan](transformation_reference#e_zoompan) in the _Transformation Reference_.

> **Learn more**:
>
> * [Read this blog](https://cloudinary.com/blog/add-motion-to-your-pictures) to see some more applications of the `zoompan` effect.

.select-wrapper {
    position: relative;
    width: 200px;
    margin-bottom: 20px;
}
.custom-select {
    position: relative;
    width: 100%;
}
.select-selected {
    background-color: var(--dropdown-menu-bg-color);
    padding: 10px 35px 10px 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}
.select-selected::after {
    content: '\25BC';
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
}
.select-items {
    position: absolute;
    background-color: var(--dropdown-menu-bg-color);
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 300px;
    overflow-y: auto;
    display: none;
}
.select-item {
    padding: 10px;
    cursor: pointer;
}
.select-item:hover {
    background-color: var(--dropdown-background-active-color);
}
.language-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: middle;
}
select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: 10px 35px 10px 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: var(--dropdown-menu-bg-color);
    cursor: pointer;
}
.select-wrapper::after {
    content: '\25BC';
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
}

/*
.custom-select {
    position: relative;
    width: 200px;
}
.select-selected {
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
}
.select-selected:after {
    content: "\25BC";
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
}
.select-items {
    position: absolute;
    background-color: #fff;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
}
.select-hide {
    display: none;
}
.select-items div {
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
}
.select-items div:hover {
    background-color: #f1f1f1;
}
.language-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}
*/

.select-css-pocs {
	display: block;
	font-size: 16px;
	font-family: sans-serif;
	font-weight: 700;
	color: #3448c5;
	line-height: 1.3;
	padding: .6em 1.4em .5em .8em;
	width: 100%;
	max-width: 100%; /* useful when width is set to anything other than 100% */
	box-sizing: border-box;
	margin: 0;
	border: 1px solid #aaa;
	box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
	border-radius: .5em;
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background-color: #fff;
	/* note: bg image below uses 2 urls. The first is an svg data uri for the arrow icon, and the second is the gradient. 
		for the icon, if you want to change the color, be sure to use `%23` instead of `#`, since it's a url. You can also swap in a different svg icon or an external image reference

	*/

	background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%233448c5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');

	background-repeat: no-repeat, repeat;

	/* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
	background-position: right .7em top 50%, 0 0;
	/* icon size, then gradient */
	background-size: .65em auto, 100%;
}

/* CSS for demos */

.select-css {
	display: block;
	font-size: 16px;
	font-family: sans-serif;
	font-weight: 700;
	color: #FF5050;
	line-height: 1.3;
	padding: .6em 1.4em .5em .8em;
	width: 100%;
	max-width: 100%; /* useful when width is set to anything other than 100% */
	box-sizing: border-box;
	margin: 0;
	border: 1px solid #aaa;
	box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
	border-radius: .5em;
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background-color: #fff;
	/* note: bg image below uses 2 urls. The first is an svg data uri for the arrow icon, and the second is the gradient. 
		for the icon, if you want to change the color, be sure to use `%23` instead of `#`, since it's a url. You can also swap in a different svg icon or an external image reference

	*/

	background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FF5050%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');

	background-repeat: no-repeat, repeat;

	/* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
	background-position: right .7em top 50%, 0 0;
	/* icon size, then gradient */
	background-size: .65em auto, 100%;
}
/* Hide arrow icon in IE browsers */
.select-css::-ms-expand {
	display: none;
}
/* Hover style */
.select-css:hover {
	border-color: #888;
}
/* Focus style */
.select-css:focus {
	border-color: #FF5050;
	/* It'd be nice to use -webkit-focus-ring-color here but it doesn't work on box-shadow */
	box-shadow: 0 0 1px 3px rgba(255, 80, 80, .7);
	box-shadow: 0 0 0 3px -moz-mac-focusring;
	color: #FF5050; 
	outline: none;
}

/* Set options to normal weight */
.select-css option {
	font-weight:normal;
}

/* Support for rtl text, explicit support for Arabic and Hebrew */
*[dir="rtl"] .select-css, :root:lang(ar) .select-css, :root:lang(iw) .select-css {
	background-position: left .7em top 50%, 0 0;
	padding: .6em .8em .5em 1.4em;
}

/* Disabled styles */
.select-css:disabled, .select-css[aria-disabled=true] {
	color: graytext;
	background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22graytext%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
	  linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
}

.select-css:disabled:hover, .select-css[aria-disabled=true] {
	border-color: #aaa;

}

table{
    table-layout: fixed;
}

.time_warn{
  color: #FF0000;
  font-size:12px;
}

.instructions{
font-family: Tahoma;
text-align: center;
padding-left: 10%;
padding-right: 10%;
  color: #0c163b;
}

.instructions-large{
  font-family: Tahoma;
  text-align: center;
  font-size:20px;
  padding-left: 10%;
  padding-right: 10%;
  color: #0c163b;
  }

.selectcontainer {
   color: #FF5050;
   font-weight: bold;
   font-size:90%;
}

.selectcontainer-padleft {
  color: #FF5050;
  font-weight: bold;
  font-size:90%;
  padding-left: 15%;
}

.size_value{
  color: #FF5050;
  font-weight: bold;
}

.thumb-img {
  border: solid 6px #aaa;
  border-radius: 6px;
  opacity: 0.5;
}

.thumb-img:hover {
  border: solid 6px #FF8383;
  border-radius: 6px;
  cursor: pointer;
  opacity: 1;
}

.thumb-img.active {
  border: solid 6px #FF5050;
  border-radius: 6px;
  opacity: 1;
}

.art-img, .photo-img  {
  border: solid 6px #aaa;
  border-radius: 6px;
  opacity: 0.5;
}

.art-img:hover,  .photo-img:hover{
  border: solid 6px #f5956c;
  border-radius: 6px;
  cursor: pointer;
  opacity: 1;
}

.art-img.active, .photo-img.active {
  border: solid 6px #FF5050;
  border-radius: 6px;
  opacity: 1;
}

.select_label{
   color: #3448C5;
   font-weight: bold;
}

.select_label1{
  color: #0c163b;
  font-weight: bold;
  font-size: 12px;
}

.select_label2{
  color: #0c163b;
  font-weight: normal;
}

.env_select_label{
   color: #3448C5;
   font-weight: bold;
   padding-left: 15%;
}

.sliders{
  display: inline;
}

.slider_value{
   color: #FF5050;
   font-weight: bold;
}

.slider_label{
   color: #3448C5;
   font-weight: bold;
  padding-left: 15%;
}

.step_number {
        background:  black;
        color:  white;
        width: 24px;
        height: 24px;
        display: inline-block;
        text-align: center;
        line-height: 24px;
        border-radius: 100px;
}

.slidecontainer {
  width: 85%; /* Width of the outside container */
  text-align: center;
float: right;
padding-right: 15%;
}

/* The slider itself */

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;  
  background: #3448C5;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%; 
  background: #FF5050;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #FF5050;
  cursor: pointer;
}

.cloudinary-button {
  display: inline-block;
  padding: 15px 25px;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #FF5050;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}

.cloudinary-button:hover {
  background-color: #ff0303;
  cursor: pointer;
}

.cloudinary-button:active {
  background-color: #ff0303;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

.fix {
 display: block;
}

.loader {
  position: static;
  margin: auto;
  border: 16px solid #5A616A; 
  border-top: 16px solid #3448C5; 
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
} 

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.current-img {
	padding:8px 16px;
}

.demo-btn {
	border: 0px;
	background-color:#FF5050;
	border-radius:30px;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-size:14px;
	font-weight:600;;
	padding:10px 16px;
	text-decoration:none;
	
}
.demo-btn:hover {
	background-color:#ff0303;
}

a.demo-btn:link, a.demo-btn:visited, a.demo-btn:hover, a.demo-btn:active {
	color: #ffffff;
	text-decoration:none;
}

.demo-btn:active {
	position:relative;
	top:1px;
}

span.mystep {
  background: #FF5050;
  border-radius: 0.8em;
  -moz-border-radius: 0.8em;
  -webkit-border-radius: 0.8em;
  color: #ffffff;
  display: inline-block;
  font-weight: bold;
  line-height: 1.6em;
  margin-right: 5px;
  text-align: center;
  width: 1.6em;
}

.coordinates {
  text-align: center;
  color: #0c163b;
}

.tr_all {
  display:inline-block;
  vertical-align:top;
  margin-left: 3em;
  margin-bottom: 1em;
  text-align: left;
}

.tl_all {
  display:inline-block;
  vertical-align:top;
  margin-right: 3em;
  margin-bottom: 1em;
  text-align: right;
}

.br_all {
  display:inline-block;
  vertical-align:top;
  margin-left: 3em;
  margin-bottom: 1em;
  text-align: left;
}

.bl_all {
  display:inline-block;
  vertical-align:top;
  margin-right: 3em;
  margin-bottom: 1em;
  text-align: right;
}

.options {
  font-size: 18px;
  font-weight: bold;
  color: #0c163b;
}

.coordinate-value {
  color: #FF5050;
  font-weight: bold; 
  text-align: right;  
}

/* Accessible Media Demo Styles */

/* Dark theme support for audio description demo */
[data-theme="dark"] .audio-description-demo,
body.dark-theme .audio-description-demo {
  border-color: var(--dark-border) !important;
  background: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

[data-theme="dark"] .audio-description-demo h4,
body.dark-theme .audio-description-demo h4 {
  color: var(--dark-border) !important;
}

@media (prefers-color-scheme: dark) {
  .audio-description-demo {
    border-color: var(--dark-border);
    background: var(--dark-bg);
    color: var(--dark-text);
  }
  
  .audio-description-demo h4 {
    color: var(--dark-border);
  }
}

/* Video player demo styles */
#wordHighlight {
  height: 400px;
  padding-top: unset;
}
#wordHighlight > div.vjs-poster > picture > img {
  object-fit: contain;
}

#wordHighlight > div.vjs-poster > picture {
  background: var(--main-content-color);
}
#wordHighlight.video-js {
  background-color: var(--main-content-color);
}

/* Dark theme support for colorblind demo */
[data-theme="dark"] .colorblind-demo,
body.dark-theme .colorblind-demo {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-theme="dark"] .colorblind-demo label,
body.dark-theme .colorblind-demo label {
  color: #e2e8f0 !important;
}

[data-theme="dark"] .colorblind-demo select,
body.dark-theme .colorblind-demo select {
  background-color: #4a5568 !important;
  color: #e2e8f0 !important;
  border: 1px solid #718096 !important;
}

[data-theme="dark"] .url-display,
body.dark-theme .url-display {
  background-color: #2c5282 !important;
  border: 1px solid #3182ce !important;
}

[data-theme="dark"] .url-display h4,
body.dark-theme .url-display h4 {
  color: #63b3ed !important;
}

[data-theme="dark"] .url-display code,
body.dark-theme .url-display code {
  color: #e2e8f0 !important;
}

[data-theme="dark"] .tips-section,
body.dark-theme .tips-section {
  background-color: #744210 !important;
  border: 1px solid #975a16 !important;
}

[data-theme="dark"] .tips-section h4,
body.dark-theme .tips-section h4 {
  color: #fbb041 !important;
}

[data-theme="dark"] .tips-section,
[data-theme="dark"] .tips-section ul,
[data-theme="dark"] .tips-section li,
body.dark-theme .tips-section,
body.dark-theme .tips-section ul,
body.dark-theme .tips-section li {
  color: #faf089 !important;
}

@media (prefers-color-scheme: dark) {
  .colorblind-demo {
    background-color: #2d3748 !important;
    border-color: #4a5568 !important;
    color: #e2e8f0 !important;
  }
  
  .colorblind-demo label {
    color: #e2e8f0 !important;
  }
  
  .colorblind-demo select {
    background-color: #4a5568 !important;
    color: #e2e8f0 !important;
    border: 1px solid #718096 !important;
  }
  
  .url-display {
    background-color: #2c5282 !important;
    border: 1px solid #3182ce !important;
  }
  
  .url-display h4 {
    color: #63b3ed !important;
  }
  
  .url-display code {
    color: #e2e8f0 !important;
  }
  
  .tips-section {
    background-color: #744210 !important;
    border: 1px solid #975a16 !important;
  }
  
  .tips-section h4 {
    color: #fbb041 !important;
  }
  
  .tips-section,
  .tips-section ul,
  .tips-section li {
    color: #faf089 !important;
  }
}

/* Dark theme support for text overlay demo */
[data-theme="dark"] .text-overlay-demo label,
[data-theme="dark"] .text-overlay-demo input,
[data-theme="dark"] .text-overlay-demo select {
  --text-color: #e2e8f0;
  --input-bg: #2d3748;
}

body.dark-theme .text-overlay-demo label,
body.dark-theme .text-overlay-demo input,
body.dark-theme .text-overlay-demo select {
  --text-color: #e2e8f0;
  --input-bg: #2d3748;
}

@media (prefers-color-scheme: dark) {
  .text-overlay-demo label,
  .text-overlay-demo input,
  .text-overlay-demo select {
    --text-color: #e2e8f0;
    --input-bg: #2d3748;
  }
}

/* Dark theme support for OCR text content */
[data-theme="dark"] .ocr-text-content,
body.dark-theme .ocr-text-content {
  background: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

@media (prefers-color-scheme: dark) {
  .ocr-text-content {
    background: var(--dark-bg);
    color: var(--dark-text);
  }
}

/* Dark theme support for audio mixing demo */
[data-theme="dark"] .db-status-container,
body.dark-theme .db-status-container {
  background: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

@media (prefers-color-scheme: dark) {
  .db-status-container {
    background: var(--dark-bg);
    color: var(--dark-text);
  }
}

/* Dark theme support for motion demo */
[data-theme="dark"] .motion-demo-container,
body.dark-theme .motion-demo-container {
  border-color: var(--dark-border) !important;
  background: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

@media (prefers-color-scheme: dark) {
  .motion-demo-container {
    border-color: var(--dark-border);
    background: var(--dark-bg);
    color: var(--dark-text);
  }
}

/* Dark theme support for gallery demo container */
[data-theme="dark"] #accessible-gallery-demo,
body.dark-theme #accessible-gallery-demo {
  background: #2d3748 !important;
  border-color: #4a90e2 !important;
}

[data-theme="dark"] #accessible-gallery-demo h4,
body.dark-theme #accessible-gallery-demo h4 {
  color: #4a90e2 !important;
}

[data-theme="dark"] #accessible-gallery-demo p,
body.dark-theme #accessible-gallery-demo p {
  color: #e2e8f0 !important;
}

@media (prefers-color-scheme: dark) {
  #accessible-gallery-demo {
    background: #2d3748;
    border-color: #4a90e2;
  }
  
  #accessible-gallery-demo h4 {
    color: #4a90e2;
  }
  
  #accessible-gallery-demo p {
    color: #e2e8f0;
  }
}

/* Dark theme support for keyboard controls */
[data-theme="dark"] .keyboard-controls-container,
body.dark-theme .keyboard-controls-container {
  border-color: var(--dark-border) !important;
  background: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

[data-theme="dark"] .keyboard-controls-container h4,
body.dark-theme .keyboard-controls-container h4 {
  color: var(--dark-border) !important;
}

[data-theme="dark"] .keyboard-key,
body.dark-theme .keyboard-key {
  background: var(--dark-kbd-bg) !important;
  color: var(--dark-kbd-text) !important;
  border-color: #718096 !important;
}

@media (prefers-color-scheme: dark) {
  .keyboard-controls-container {
    border-color: var(--dark-border);
    background: var(--dark-bg);
    color: var(--dark-text);
  }
  
  .keyboard-controls-container h4 {
    color: var(--dark-border);
  }
  
  .keyboard-key {
    background: var(--dark-kbd-bg);
    color: var(--dark-kbd-text);
    border-color: #718096;
  }
}

/* Dark theme support for video player demo */
[data-theme="dark"] .video-player-demo,
body.dark-theme .video-player-demo {
  border-color: var(--dark-border) !important;
  background: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

[data-theme="dark"] .video-player-demo h4,
body.dark-theme .video-player-demo h4 {
  color: var(--dark-border) !important;
}

[data-theme="dark"] .video-demo-features,
body.dark-theme .video-demo-features {
  color: var(--dark-subtext) !important;
}

@media (prefers-color-scheme: dark) {
  .video-player-demo {
    border-color: var(--dark-border);
    background: var(--dark-bg);
    color: var(--dark-text);
  }
  
  .video-player-demo h4 {
    color: var(--dark-border);
  }
  
  .video-demo-features {
    color: var(--dark-subtext);
  }
}

/* Dark theme support for upload widget demo */
[data-theme="dark"] .upload-widget-demo,
body.dark-theme .upload-widget-demo {
  border-color: var(--dark-border) !important;
  background: var(--dark-bg) !important;
  color: var(--dark-text) !important;
}

[data-theme="dark"] .upload-widget-demo h4,
body.dark-theme .upload-widget-demo h4 {
  color: var(--dark-border) !important;
}

[data-theme="dark"] .upload-widget-demo > div:last-child,
body.dark-theme .upload-widget-demo > div:last-child {
  color: var(--dark-subtext) !important;
}

@media (prefers-color-scheme: dark) {
  .upload-widget-demo {
    border-color: var(--dark-border);
    background: var(--dark-bg);
    color: var(--dark-text);
  }
  
  .upload-widget-demo h4 {
    color: var(--dark-border);
  }
  
  .upload-widget-demo > div:last-child {
    color: var(--dark-subtext);
  }
}

