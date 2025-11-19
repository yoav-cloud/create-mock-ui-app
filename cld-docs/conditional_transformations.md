# Conditional image transformations

Cloudinary supports conditional transformations for images, where a transformation is only applied if a specified condition is met, for example, if an image's width is greater than 300 pixels, apply a certain transformation. 
**See also**: [Conditional transformations for video](video_conditional_expressions).

## Specifying conditions
To specify a condition to be met before applying a transformation, use the `if` parameter (also `if` in URLs). The `if` parameter accepts a string value detailing the condition to evaluate, and is specified in the URL in the following format:

<code>
if\_\\_\\_\

**Where:**

* <code>image characteristic: The image parameter representing the characteristic to evaluate, for example `w` (or `width` in SDKs).
* `operator`: The comparison operator for the comparison, for example `lt` for 'less than' (or `image characteristic value: A hard coded value to check against, a supported user-defined variable containing a value to check against, or a different image characteristic you want to compare to. For example, if you only want to apply a transformation to non-square images, you could check if the width characteristic of your image is not equal to its height characteristic: `if_w_ne_h`

> **TIP**:
>
> :title=Tips

> * Specify strings for a characteristic sub-element or value surrounded by `! !`. For example, `if_  if_ctx:!productType!_eq_!shoes!`.

> * You can check whether a string characteristic currently has no value using `!!`. 
> For example: `if some-condition_eq_!!`
See [examples](#conditional_transformation_examples) below.

### Supported image characteristics
Characteristic | Description  
---|---
`w` | (also `width` in SDKs) The asset's current width.
`iw` | The asset's initial width.
`h` | (also `height` in SDKs) The asset's current height.
`ih` | The asset's initial height.
`ar` | (also `aspect_ratio` in SDKs) The aspect ratio of the asset. The compared value can be either decimal (e.g., 1.5) or a ratio (e.g., 3:4).
`iar` | The asset's initial aspect ratio.
`ctx` | A contextual metadata value assigned to an asset.
`md` | A structured metadata value assigned to an asset.
`tags` | The set of tags assigned to the asset. `tar` (`trimmed_aspect_ratio` in SDKs)  | The aspect ratio of the image IF it was trimmed (using the 'trim' effect) without actually trimming the image. The compared value can be either decimal (e.g., 1.5) or a ratio (e.g., 3:4).
`cp` | The current page in the image/document. 
`fc` (`face_count` in SDKs) |  The total number of detected faces in the image.
`ccc` (`custom_coordinates_count` in SDKs) | The number of [custom coordinate sets](custom_focus_areas#custom_coordinates) defined for the image.
`rc` (`regions_count` in SDKs) | The number of [named regions](custom_focus_areas#custom_regions) set on the image.
`pc` (`page_count` in SDKs) |  The total number of pages in the image/document.
`px` | A layer or page's original x offset position relative to the whole composition (for example, in a PSD or TIFF file).
`py` | A layer or page's original y offset position relative to the whole composition (for example, in a PSD or TIFF file).
`idn` | The initial density (DPI) of the image.
`ils` | The likelihood that the image is an illustration (as opposed to a photo).  Supported values: 0 (photo) to 1 (illustration)
`rn` (`region_names` in SDKs) | The names of [regions](custom_focus_areas#custom_regions) set on the image.Use with the [in or nin operators](#using_the_in_and_nin_operators).
`pgnames` | The names of layers in a TIFF file.Use with the [in or nin operators](#using_the_in_and_nin_operators).

### Supported operators
URL | SDK symbol | Description  
---|---|---
`eq` | `=` | Equal to 
`ne` | `!=` |Not equal to
`lt` | `` |Greater than
`lte`  | `=` |Greater than or equal to
`in`&#124;`nin` | `in`&#124;`nin` | Included in &#124; Not included inCompares a set of strings against another set of strings. See [Using the in and nin operators](#using_the_in_and_nin_operators) for examples.

When working with the Cloudinary SDKs, you can specify the condition using the SDK characteristic names and operator symbols, or you can specify it using the URL format. For example, both of the following are valid:

* { if: "w\_gt\_1000"},...
* { if: "width > 1000"},...
#### Using the in and nin operators
The `in` and `nin` operators compare two sets of strings.  The `:` delimiter between strings denotes **AND**. 
String sets can include **tags**, **contextual metadata** or **structured metadata** values, for example: 

* To determine if `sale` and `in_stock` are present in the tags of a particular asset, use: `if_!sale:in_stock!_in_tags`.
* To determine if the key named `color` exists in the contextual metadata of a particular asset, use: `if_!color!_in_ctx`.
* To determine if a structured metadata field with external ID, `color-id`, has been set for a particular asset, use: `if_!color-id!_in_md`.
* To determine if a list value with external ID, `green-id`, has been selected from a multiple-selection structured metadata field with external ID, `colors-id`, for a particular asset, use: `if_!green-id!_in_md:!colors-id!`.
* To determine if a region named `hat` has been set on an image, use:`if_!hat!_in_rn`.

For TIFF files:

* To determine if a TIFF file contains a layer called `Shadow`, use: `if_!Shadow!_in_pgnames`.

### Supported conditional image transformation parameters and flags

* **All image transformation parameters** can be assigned in conditions **except**: 
    * You cannot assign transformation parameters for the `format`, `fetch_format`, `default_image`, `color_space`, or `delay` parameters. 
    * The `page` (`pg` in URLs) parameter cannot be assigned for animated images (`page` can be used in conditions for PSD, PDF, or TIFF documents).
    * The `angle` parameter cannot be set to `ignore`.

* **Only the following flags** are supported inside conditional image transformations: `layer_apply`, `region_relative`, `relative`, `progressive`, `cutter`, `png8`, `attachment`, `awebp`, `lossy`

### Notes
* For the `w`, `h`, `cp` and `ar` parameters, the values refer to the current image status in the transformation chain (i.e., if transformations have already been applied to the image), while `iw`, `ih`, `fc` and `pc` always refer to the original image.
* `dpr` is not supported as a conditional transformation with the `cp` and `ar` characteristics. Additionally, `w` and `h` are supported with `dpr` as long as they are still equal to `iw` or `ih` when the condition is evaluated. If `dpr` is specified in the transformation as a whole, and one of the conditional branches includes a resizing transformation, you need to specify a resize transformation in all the other branches too.
* The `ar` (aspect ratio) parameter should be compared using 'greater than' or 'less than' rather than with 'equals'. This is because the width and height values are given as integers and not floating point values, leading to an "almost exact" calculated aspect ratio.
* Contextual metadata values are always stored as strings, even if the value is numeric, therefore you cannot use the `lt`, `gt`, `lte` and `gte` operators to compare contextual metadata values numerically. You can, however, use these operators with numeric structured metadata  values - [see an example](#conditional_image_overlay_based_on_structured_metadata_value).
* You can test whether or not a variable has been defined using the parameters `if_isdef_$<variable name>` and `if_isndef_$<variable name>` (see [Testing whether a variable has been defined](user_defined_variables#testing_whether_a_variable_has_been_defined)).

## Specifying transformations for a condition
The transformation for a condition should be specified between the condition component and an `if_end` component in the format: 

`if_condition/transformation/if_end`

For example:

<code>if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end

In the following examples, both images are scaled to a width of 500px. Afterwards, the identical conditional padded-resize transformation shown above is applied to both images. However, since the condition applies only for portrait images (those with an aspect ratio less than 1.0) the resizing and padding is applied only to the <code>mountain-road-boat image below:

![Conditional transformation on landscape video](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end/rafting.mp4)

```nodejs
cloudinary.video("rafting", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "darkorange", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react
new CloudinaryVideo("rafting.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```vue
new CloudinaryVideo("rafting.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```angular
new CloudinaryVideo("rafting.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```js
new CloudinaryVideo("rafting.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```python
CloudinaryVideo("rafting").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'if': "ar_lt_1.0"},
  {'background': "darkorange", 'height': 300, 'width': 500, 'crop': "pad"},
  {'if': "end"}
  ])
```

```php
(new VideoTag('rafting.mp4'))
	->resize(Resize::scale()->width(500))
	->conditional(Conditional::ifCondition("aspect_ratio < 1.0",(new Transformation())
	->resize(Resize::pad()->width(500)
->height(300)
	->background(
	Background::color(Color::DARKORANGE))
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("darkorange").height(300).width(500).crop("pad").chain()
  .if("end")).videoTag("rafting");
```

```ruby
cl_video_tag("rafting", transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "darkorange", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .If("ar_lt_1.0").Chain()
  .Background("darkorange").Height(300).Width(500).Crop("pad").Chain()
  .If("end")).BuildVideoTag("rafting")
```

```dart
cloudinary.video('rafting.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setIf("ar_lt_1.0").chain()
  .setBackground("darkorange").setHeight(300).setWidth(500).setCrop("pad").chain()
  .setIf("end")).generate("rafting.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("darkorange").height(300).width(500).crop("pad").chain()
  .if("end")).resourceType("video").generate("rafting.mp4");
```

```flutter
cloudinary.video('rafting.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end"));
```

```kotlin
cloudinary.video {
	publicId("rafting.mp4")
	 addTransformation("c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end") 
}.generate()
```

```jquery
$.cloudinary.video("rafting", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "darkorange", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryVideo("rafting.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```
![Same conditional transformation on portrait video](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end/docs/parrot.mp4)

```nodejs
cloudinary.video("docs/parrot", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "darkorange", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react
new CloudinaryVideo("docs/parrot.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```vue
new CloudinaryVideo("docs/parrot.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```angular
new CloudinaryVideo("docs/parrot.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```js
new CloudinaryVideo("docs/parrot.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

```python
CloudinaryVideo("docs/parrot").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'if': "ar_lt_1.0"},
  {'background': "darkorange", 'height': 300, 'width': 500, 'crop': "pad"},
  {'if': "end"}
  ])
```

```php
(new VideoTag('docs/parrot.mp4'))
	->resize(Resize::scale()->width(500))
	->conditional(Conditional::ifCondition("aspect_ratio < 1.0",(new Transformation())
	->resize(Resize::pad()->width(500)
->height(300)
	->background(
	Background::color(Color::DARKORANGE))
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("darkorange").height(300).width(500).crop("pad").chain()
  .if("end")).videoTag("docs/parrot");
```

```ruby
cl_video_tag("docs/parrot", transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "darkorange", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .If("ar_lt_1.0").Chain()
  .Background("darkorange").Height(300).Width(500).Crop("pad").Chain()
  .If("end")).BuildVideoTag("docs/parrot")
```

```dart
cloudinary.video('docs/parrot.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setIf("ar_lt_1.0").chain()
  .setBackground("darkorange").setHeight(300).setWidth(500).setCrop("pad").chain()
  .setIf("end")).generate("docs/parrot.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("darkorange").height(300).width(500).crop("pad").chain()
  .if("end")).resourceType("video").generate("docs/parrot.mp4");
```

```flutter
cloudinary.video('docs/parrot.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end"));
```

```kotlin
cloudinary.video {
	publicId("docs/parrot.mp4")
	 addTransformation("c_scale,w_500/if_ar_lt_1.0/b_darkorange,c_pad,h_300,w_500/if_end") 
}.generate()
```

```jquery
$.cloudinary.video("docs/parrot", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "darkorange", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryVideo("docs/parrot.mp4")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(color("darkorange"))
      )
    )
  );
```

![Conditional transformation on landscape image](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end/docs/autumn_woods.jpg)

```nodejs
cloudinary.image("docs/autumn_woods.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "auto", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```vue
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```angular
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```js
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```python
CloudinaryImage("docs/autumn_woods.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'if': "ar_lt_1.0"},
  {'background': "auto", 'height': 300, 'width': 500, 'crop': "pad"},
  {'if': "end"}
  ])
```

```php
(new ImageTag('docs/autumn_woods.jpg'))
	->resize(Resize::scale()->width(500))
	->conditional(Conditional::ifCondition("aspect_ratio < 1.0",(new Transformation())
	->resize(Resize::pad()->width(500)
->height(300)
	->background(
	Background::auto())
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("auto").height(300).width(500).crop("pad").chain()
  .if("end")).imageTag("docs/autumn_woods.jpg");
```

```ruby
cl_image_tag("docs/autumn_woods.jpg", transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "auto", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .If("ar_lt_1.0").Chain()
  .Background("auto").Height(300).Width(500).Crop("pad").Chain()
  .If("end")).BuildImageTag("docs/autumn_woods.jpg")
```

```dart
cloudinary.image('docs/autumn_woods.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setIf("ar_lt_1.0").chain()
  .setBackground("auto").setHeight(300).setWidth(500).setCrop("pad").chain()
  .setIf("end")).generate("docs/autumn_woods.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("auto").height(300).width(500).crop("pad").chain()
  .if("end")).generate("docs/autumn_woods.jpg");
```

```flutter
cloudinary.image('docs/autumn_woods.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end"));
```

```kotlin
cloudinary.image {
	publicId("docs/autumn_woods.jpg")
	 addTransformation("c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end") 
}.generate()
```

```jquery
$.cloudinary.image("docs/autumn_woods.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "auto", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryImage("docs/autumn_woods.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```
![Same conditional transformation on portrait image](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end/docs/mountain-road-boat.jpg)

```nodejs
cloudinary.image("docs/mountain-road-boat.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "auto", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react
new CloudinaryImage("docs/mountain-road-boat.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```vue
new CloudinaryImage("docs/mountain-road-boat.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```angular
new CloudinaryImage("docs/mountain-road-boat.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```js
new CloudinaryImage("docs/mountain-road-boat.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

```python
CloudinaryImage("docs/mountain-road-boat.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'if': "ar_lt_1.0"},
  {'background': "auto", 'height': 300, 'width': 500, 'crop': "pad"},
  {'if': "end"}
  ])
```

```php
(new ImageTag('docs/mountain-road-boat.jpg'))
	->resize(Resize::scale()->width(500))
	->conditional(Conditional::ifCondition("aspect_ratio < 1.0",(new Transformation())
	->resize(Resize::pad()->width(500)
->height(300)
	->background(
	Background::auto())
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("auto").height(300).width(500).crop("pad").chain()
  .if("end")).imageTag("docs/mountain-road-boat.jpg");
```

```ruby
cl_image_tag("docs/mountain-road-boat.jpg", transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "auto", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .If("ar_lt_1.0").Chain()
  .Background("auto").Height(300).Width(500).Crop("pad").Chain()
  .If("end")).BuildImageTag("docs/mountain-road-boat.jpg")
```

```dart
cloudinary.image('docs/mountain-road-boat.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setIf("ar_lt_1.0").chain()
  .setBackground("auto").setHeight(300).setWidth(500).setCrop("pad").chain()
  .setIf("end")).generate("docs/mountain-road-boat.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .if("ar_lt_1.0").chain()
  .background("auto").height(300).width(500).crop("pad").chain()
  .if("end")).generate("docs/mountain-road-boat.jpg");
```

```flutter
cloudinary.image('docs/mountain-road-boat.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end"));
```

```kotlin
cloudinary.image {
	publicId("docs/mountain-road-boat.jpg")
	 addTransformation("c_scale,w_500/if_ar_lt_1.0/b_auto,c_pad,h_300,w_500/if_end") 
}.generate()
```

```jquery
$.cloudinary.image("docs/mountain-road-boat.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {if: "ar_lt_1.0"},
  {background: "auto", height: 300, width: 500, crop: "pad"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryImage("docs/mountain-road-boat.jpg")
  .resize(scale().width(500))
  .conditional(
    ifCondition(
      "aspect_ratio < 1.0",
      new Transformation().resize(
        pad().width(500).height(300).background(auto())
      )
    )
  );
```

> **NOTE**:
>
> Transformation URLs technically support defining both the condition and a single resulting transformation inside a single transformation component (without the need for a closing `end_if`). However, to avoid ambiguity, the best practice is to always use `if` and  `if_end` components in your URL as shown above. 

> * Some SDKs require this separation and automatically generate URLs in the `if...end_if` format.

> * A [named transformation](image_transformations#named_transformations) cannot be placed in the same transformation component as its condition (e.g., `if_w_eq_h,t_trans` is not supported) and must be specified using the  `if...if_end` format. 

> * If you do include both the `if` condition and the resulting transformation parameters within a single component of the URL, the `if` condition is evaluated first, regardless of its location within the component and (only) when the condition is true, all transformation parameters specified in that component are applied.
### Conditions with chained transformations
You can apply multiple chained transformations to your condition by including the entire chained transformation in between the `if` and `if_end` components.
For example, if you allocate space on your page for an image with a width of 700px, you can conditionally add a 700px width blurred underlay version of the same image along with a text overlay, only for those images whose original width is less than 700px:

![conditional background](https://res.cloudinary.com/demo/image/upload/if_w_lt_700/co_white,l_text:Arial_20:Image%2520shown%2520in%2520full%2520scale/fl_layer_apply,g_south_east/u_docs:luggage/c_scale,w_700/e_blur:400/fl_layer_apply/if_end/docs/luggage.jpg)

```nodejs
cloudinary.image("docs/luggage.jpg", {transformation: [
  {if: "w_lt_700"},
  {color: "white", overlay: {font_family: "Arial", font_size: 20, text: "Image%2520shown%2520in%2520full%2520scale"}},
  {flags: "layer_apply", gravity: "south_east"},
  {underlay: "docs:luggage"},
  {width: 700, crop: "scale"},
  {effect: "blur:400"},
  {flags: "layer_apply"},
  {if: "end"}
  ]})
```

```react
new CloudinaryImage("docs/luggage.jpg").conditional(
  ifCondition(
    "width < 700",
    new Transformation()
      .overlay(
        source(
          text(
            "Image%20shown%20in%20full%20scale",
            new TextStyle("Arial", 20)
          ).textColor("white")
        ).position(new Position().gravity(compass("south_east")))
      )
      .underlay(
        source(
          image("docs/luggage").transformation(
            new Transformation()
              .resize(scale().width(700))
              .effect(blur().strength(400))
          )
        )
      )
  )
);
```

```vue
new CloudinaryImage("docs/luggage.jpg").conditional(
  ifCondition(
    "width < 700",
    new Transformation()
      .overlay(
        source(
          text(
            "Image%20shown%20in%20full%20scale",
            new TextStyle("Arial", 20)
          ).textColor("white")
        ).position(new Position().gravity(compass("south_east")))
      )
      .underlay(
        source(
          image("docs/luggage").transformation(
            new Transformation()
              .resize(scale().width(700))
              .effect(blur().strength(400))
          )
        )
      )
  )
);
```

```angular
new CloudinaryImage("docs/luggage.jpg").conditional(
  ifCondition(
    "width < 700",
    new Transformation()
      .overlay(
        source(
          text(
            "Image%20shown%20in%20full%20scale",
            new TextStyle("Arial", 20)
          ).textColor("white")
        ).position(new Position().gravity(compass("south_east")))
      )
      .underlay(
        source(
          image("docs/luggage").transformation(
            new Transformation()
              .resize(scale().width(700))
              .effect(blur().strength(400))
          )
        )
      )
  )
);
```

```js
new CloudinaryImage("docs/luggage.jpg").conditional(
  ifCondition(
    "width < 700",
    new Transformation()
      .overlay(
        source(
          text(
            "Image%20shown%20in%20full%20scale",
            new TextStyle("Arial", 20)
          ).textColor("white")
        ).position(new Position().gravity(compass("south_east")))
      )
      .underlay(
        source(
          image("docs/luggage").transformation(
            new Transformation()
              .resize(scale().width(700))
              .effect(blur().strength(400))
          )
        )
      )
  )
);
```

```python
CloudinaryImage("docs/luggage.jpg").image(transformation=[
  {'if': "w_lt_700"},
  {'color': "white", 'overlay': {'font_family': "Arial", 'font_size': 20, 'text': "Image%2520shown%2520in%2520full%2520scale"}},
  {'flags': "layer_apply", 'gravity': "south_east"},
  {'underlay': "docs:luggage"},
  {'width': 700, 'crop': "scale"},
  {'effect': "blur:400"},
  {'flags': "layer_apply"},
  {'if': "end"}
  ])
```

```php
(new ImageTag('docs/luggage.jpg'))
	->conditional(Conditional::ifCondition("width < 700",(new Transformation())
	->overlay(Overlay::source(
	Source::text("Image%20shown%20in%20full%20scale",(new TextStyle("Arial",20)))
	->textColor(Color::WHITE)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::southEast()))
	)
	)
	->underlay(Underlay::source(
	Source::image("docs/luggage")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(700))
	->effect(Effect::blur()->strength(400)))
	))));
```

```java
cloudinary.url().transformation(new Transformation()
  .if("w_lt_700").chain()
  .color("white").overlay(new TextLayer().fontFamily("Arial").fontSize(20).text("Image%2520shown%2520in%2520full%2520scale")).chain()
  .flags("layer_apply").gravity("south_east").chain()
  .underlay(new Layer().publicId("docs:luggage")).chain()
  .width(700).crop("scale").chain()
  .effect("blur:400").chain()
  .flags("layer_apply").chain()
  .if("end")).imageTag("docs/luggage.jpg");
```

```ruby
cl_image_tag("docs/luggage.jpg", transformation: [
  {if: "w_lt_700"},
  {color: "white", overlay: {font_family: "Arial", font_size: 20, text: "Image%2520shown%2520in%2520full%2520scale"}},
  {flags: "layer_apply", gravity: "south_east"},
  {underlay: "docs:luggage"},
  {width: 700, crop: "scale"},
  {effect: "blur:400"},
  {flags: "layer_apply"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .If("w_lt_700").Chain()
  .Color("white").Overlay(new TextLayer().FontFamily("Arial").FontSize(20).Text("Image%2520shown%2520in%2520full%2520scale")).Chain()
  .Flags("layer_apply").Gravity("south_east").Chain()
  .Underlay(new Layer().PublicId("docs:luggage")).Chain()
  .Width(700).Crop("scale").Chain()
  .Effect("blur:400").Chain()
  .Flags("layer_apply").Chain()
  .If("end")).BuildImageTag("docs/luggage.jpg")
```

```dart
cloudinary.image('docs/luggage.jpg').transformation(Transformation()
	.addTransformation("if_w_lt_700/co_white,l_text:Arial_20:Image%20shown%20in%20full%20scale/fl_layer_apply,g_south_east/u_docs:luggage/c_scale,w_700/e_blur:400/fl_layer_apply/if_end"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setIf("w_lt_700").chain()
  .setColor("white").setOverlay("text:Arial_20:Image%2520shown%2520in%2520full%2520scale").chain()
  .setFlags("layer_apply").setGravity("south_east").chain()
  .setUnderlay("docs:luggage").chain()
  .setWidth(700).setCrop("scale").chain()
  .setEffect("blur:400").chain()
  .setFlags("layer_apply").chain()
  .setIf("end")).generate("docs/luggage.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("w_lt_700").chain()
  .color("white").overlay(new TextLayer().fontFamily("Arial").fontSize(20).text("Image%2520shown%2520in%2520full%2520scale")).chain()
  .flags("layer_apply").gravity("south_east").chain()
  .underlay(new Layer().publicId("docs:luggage")).chain()
  .width(700).crop("scale").chain()
  .effect("blur:400").chain()
  .flags("layer_apply").chain()
  .if("end")).generate("docs/luggage.jpg");
```

```flutter
cloudinary.image('docs/luggage.jpg').transformation(Transformation()
	.addTransformation("if_w_lt_700/co_white,l_text:Arial_20:Image%20shown%20in%20full%20scale/fl_layer_apply,g_south_east/u_docs:luggage/c_scale,w_700/e_blur:400/fl_layer_apply/if_end"));
```

```kotlin
cloudinary.image {
	publicId("docs/luggage.jpg")
	 addTransformation("if_w_lt_700/co_white,l_text:Arial_20:Image%20shown%20in%20full%20scale/fl_layer_apply,g_south_east/u_docs:luggage/c_scale,w_700/e_blur:400/fl_layer_apply/if_end") 
}.generate()
```

```jquery
$.cloudinary.image("docs/luggage.jpg", {transformation: [
  {if: "w_lt_700"},
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(20).text("Image%2520shown%2520in%2520full%2520scale")},
  {flags: "layer_apply", gravity: "south_east"},
  {underlay: new cloudinary.Layer().publicId("docs:luggage")},
  {width: 700, crop: "scale"},
  {effect: "blur:400"},
  {flags: "layer_apply"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryImage("docs/luggage.jpg").conditional(
  ifCondition(
    "width < 700",
    new Transformation()
      .overlay(
        source(
          text(
            "Image%20shown%20in%20full%20scale",
            new TextStyle("Arial", 20)
          ).textColor("white")
        ).position(new Position().gravity(compass("south_east")))
      )
      .underlay(
        source(
          image("docs/luggage").transformation(
            new Transformation()
              .resize(scale().width(700))
              .effect(blur().strength(400))
          )
        )
      )
  )
);
```

## Multiple AND | OR conditions
You can specify multiple conditions to evaluate by joining the conditions with 'AND' or 'OR' conjunction operators.

> **NOTE**: 'AND' operators are evaluated before 'OR' operators.
For example, to crop the an image to a width of 300 pixels and a height of 200 pixels, only if the aspect ratio is greater than 3:4, the width is greater than 300, and the height is greater than 200 (`if_ar_gt_3:4_and_w_gt_300_and_h_gt_200`):

![Multiple conditions](https://res.cloudinary.com/demo/image/upload/if_ar_gt_3:4_and_w_gt_300_and_h_gt_200,c_crop,w_300,h_200/docs/fruit-stand.jpg)

```nodejs
cloudinary.image("docs/fruit-stand.jpg", {if: "ar_gt_3:4_and_w_gt_300_and_h_gt_200", width: 300, height: 200, crop: "crop"})
```

```react
new CloudinaryImage("docs/fruit-stand.jpg").conditional(
  ifCondition(
    "aspect_ratio > 3:4 && width > 300 && height > 200",
    new Transformation().resize(crop().width(300).height(200))
  )
);
```

```vue
new CloudinaryImage("docs/fruit-stand.jpg").conditional(
  ifCondition(
    "aspect_ratio > 3:4 && width > 300 && height > 200",
    new Transformation().resize(crop().width(300).height(200))
  )
);
```

```angular
new CloudinaryImage("docs/fruit-stand.jpg").conditional(
  ifCondition(
    "aspect_ratio > 3:4 && width > 300 && height > 200",
    new Transformation().resize(crop().width(300).height(200))
  )
);
```

```js
new CloudinaryImage("docs/fruit-stand.jpg").conditional(
  ifCondition(
    "aspect_ratio > 3:4 && width > 300 && height > 200",
    new Transformation().resize(crop().width(300).height(200))
  )
);
```

```python
CloudinaryImage("docs/fruit-stand.jpg").image(if="ar_gt_3:4_and_w_gt_300_and_h_gt_200", width=300, height=200, crop="crop")
```

```php
(new ImageTag('docs/fruit-stand.jpg'))
	->conditional(Conditional::ifCondition("aspect_ratio > 3:4 && width > 300 && height > 200",(new Transformation())
	->resize(Resize::crop()->width(300)
->height(200))));
```

```java
cloudinary.url().transformation(new Transformation().if("ar_gt_3:4_and_w_gt_300_and_h_gt_200").width(300).height(200).crop("crop")).imageTag("docs/fruit-stand.jpg");
```

```ruby
cl_image_tag("docs/fruit-stand.jpg", if: "ar_gt_3:4_and_w_gt_300_and_h_gt_200", width: 300, height: 200, crop: "crop")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().If("ar_gt_3:4_and_w_gt_300_and_h_gt_200").Width(300).Height(200).Crop("crop")).BuildImageTag("docs/fruit-stand.jpg")
```

```dart
cloudinary.image('docs/fruit-stand.jpg').transformation(Transformation()
	.addTransformation("if_ar_gt_3:4_and_w_gt_300_and_h_gt_200,c_crop,w_300,h_200"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setIf("ar_gt_3:4_and_w_gt_300_and_h_gt_200").setWidth(300).setHeight(200).setCrop("crop")).generate("docs/fruit-stand.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().if("ar_gt_3:4_and_w_gt_300_and_h_gt_200").width(300).height(200).crop("crop")).generate("docs/fruit-stand.jpg");
```

```flutter
cloudinary.image('docs/fruit-stand.jpg').transformation(Transformation()
	.addTransformation("if_ar_gt_3:4_and_w_gt_300_and_h_gt_200,c_crop,w_300,h_200"));
```

```kotlin
cloudinary.image {
	publicId("docs/fruit-stand.jpg")
	 addTransformation("if_ar_gt_3:4_and_w_gt_300_and_h_gt_200,c_crop,w_300,h_200") 
}.generate()
```

```jquery
$.cloudinary.image("docs/fruit-stand.jpg", {if: "ar_gt_3:4_and_w_gt_300_and_h_gt_200", width: 300, height: 200, crop: "crop"})
```

```react_native
new CloudinaryImage("docs/fruit-stand.jpg").conditional(
  ifCondition(
    "aspect_ratio > 3:4 && width > 300 && height > 200",
    new Transformation().resize(crop().width(300).height(200))
  )
);
```
> **NOTE**: It's also possible to define multiple separate conditions, each with its own transformation result by using multiple `if...end_if` chained components in the URL.
## Else branch transformations
You can specify a transformation that is applied in the case that the initial condition is evaluated as false (and hence the transformations associated with the condition are not applied), by using the `if_else` parameter to specify this fallback transformation.
For example, to set a condition where images with an original width less than or equal to 400px, will be scaled to fill a 240x120px container (`if_iw_lte_400/c_fill,h_120,w_240`), while images whose original width is width larger than 400px, will be scaled to fill a 240x400px container (`if_else/c_fill,h_240,w_400`):

![Else conditions](https://res.cloudinary.com/demo/image/upload/if_iw_lte_400/c_fill,h_120,w_240/if_else/c_fill,h_240,w_400/if_end/docs/shoppable_bag.jpg)

```nodejs
cloudinary.image("docs/shoppable_bag.jpg", {transformation: [
  {if: "iw_lte_400"},
  {height: 120, width: 240, crop: "fill"},
  {if: "else"},
  {height: 240, width: 400, crop: "fill"},
  {if: "end"}
  ]})
```

```react
new CloudinaryImage("docs/shoppable_bag.jpg").conditional(
  ifCondition(
    "iw_lte_400",
    new Transformation().resize(fill().width(240).height(120))
  ).otherwise(new Transformation().resize(fill().width(400).height(240)))
);
```

```vue
new CloudinaryImage("docs/shoppable_bag.jpg").conditional(
  ifCondition(
    "iw_lte_400",
    new Transformation().resize(fill().width(240).height(120))
  ).otherwise(new Transformation().resize(fill().width(400).height(240)))
);
```

```angular
new CloudinaryImage("docs/shoppable_bag.jpg").conditional(
  ifCondition(
    "iw_lte_400",
    new Transformation().resize(fill().width(240).height(120))
  ).otherwise(new Transformation().resize(fill().width(400).height(240)))
);
```

```js
new CloudinaryImage("docs/shoppable_bag.jpg").conditional(
  ifCondition(
    "iw_lte_400",
    new Transformation().resize(fill().width(240).height(120))
  ).otherwise(new Transformation().resize(fill().width(400).height(240)))
);
```

```python
CloudinaryImage("docs/shoppable_bag.jpg").image(transformation=[
  {'if': "iw_lte_400"},
  {'height': 120, 'width': 240, 'crop': "fill"},
  {'if': "else"},
  {'height': 240, 'width': 400, 'crop': "fill"},
  {'if': "end"}
  ])
```

```php
(new ImageTag('docs/shoppable_bag.jpg'))
	->conditional(Conditional::ifCondition("iw_lte_400",(new Transformation())
	->resize(Resize::fill()->width(240)
->height(120)))
	->otherwise((new Transformation())
	->resize(Resize::fill()->width(400)
->height(240)))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .if("iw_lte_400").chain()
  .height(120).width(240).crop("fill").chain()
  .if("else").chain()
  .height(240).width(400).crop("fill").chain()
  .if("end")).imageTag("docs/shoppable_bag.jpg");
```

```ruby
cl_image_tag("docs/shoppable_bag.jpg", transformation: [
  {if: "iw_lte_400"},
  {height: 120, width: 240, crop: "fill"},
  {if: "else"},
  {height: 240, width: 400, crop: "fill"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .If("iw_lte_400").Chain()
  .Height(120).Width(240).Crop("fill").Chain()
  .If("else").Chain()
  .Height(240).Width(400).Crop("fill").Chain()
  .If("end")).BuildImageTag("docs/shoppable_bag.jpg")
```

```dart
cloudinary.image('docs/shoppable_bag.jpg').transformation(Transformation()
	.addTransformation("if_iw_lte_400/c_fill,h_120,w_240/if_else/c_fill,h_240,w_400/if_end"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setIf("iw_lte_400").chain()
  .setHeight(120).setWidth(240).setCrop("fill").chain()
  .setIf("else").chain()
  .setHeight(240).setWidth(400).setCrop("fill").chain()
  .setIf("end")).generate("docs/shoppable_bag.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("iw_lte_400").chain()
  .height(120).width(240).crop("fill").chain()
  .if("else").chain()
  .height(240).width(400).crop("fill").chain()
  .if("end")).generate("docs/shoppable_bag.jpg");
```

```flutter
cloudinary.image('docs/shoppable_bag.jpg').transformation(Transformation()
	.addTransformation("if_iw_lte_400/c_fill,h_120,w_240/if_else/c_fill,h_240,w_400/if_end"));
```

```kotlin
cloudinary.image {
	publicId("docs/shoppable_bag.jpg")
	 addTransformation("if_iw_lte_400/c_fill,h_120,w_240/if_else/c_fill,h_240,w_400/if_end") 
}.generate()
```

```jquery
$.cloudinary.image("docs/shoppable_bag.jpg", {transformation: [
  {if: "iw_lte_400"},
  {height: 120, width: 240, crop: "fill"},
  {if: "else"},
  {height: 240, width: 400, crop: "fill"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryImage("docs/shoppable_bag.jpg").conditional(
  ifCondition(
    "iw_lte_400",
    new Transformation().resize(fill().width(240).height(120))
  ).otherwise(new Transformation().resize(fill().width(400).height(240)))
);
```

&nbsp;
In cases where the `if` condition is not in the preceding transformation component, then the `if_else` parameter also acts as an `if_end` parameter: all chained transformation components until the one with `if_else` are only applied if the previous condition holds true. Multiple conditional transformations can also be applied by adding an `if_end` parameter to the last transformation component in the chain, and to avoid ambiguity, the component with the `if_else` parameter should not have additional transformation instructions.
For example, if the width is less than or equal to 400 pixels then fill the image to 220x180 and add a red effect, else if the width is greater than 400 pixels then fill the image to 190x300 and add an oil painting effect:

![Multiple else branch conditions](https://res.cloudinary.com/demo/image/upload/if_w_lte_400/c_fill,h_220,w_180/e_red/if_else/c_fill,h_190,w_300/e_oil_paint/if_end/docs/cappuccino.jpg)

```nodejs
cloudinary.image("docs/cappuccino.jpg", {transformation: [
  {if: "w_lte_400"},
  {height: 220, width: 180, crop: "fill"},
  {effect: "red"},
  {if: "else"},
  {height: 190, width: 300, crop: "fill"},
  {effect: "oil_paint"},
  {if: "end"}
  ]})
```

```react
new CloudinaryImage("docs/cappuccino.jpg").conditional(
  ifCondition(
    "w_lte_400",
    new Transformation().resize(fill().width(180).height(220)).adjust(red())
  ).otherwise(
    new Transformation()
      .resize(fill().width(300).height(190))
      .effect(oilPaint())
  )
);
```

```vue
new CloudinaryImage("docs/cappuccino.jpg").conditional(
  ifCondition(
    "w_lte_400",
    new Transformation().resize(fill().width(180).height(220)).adjust(red())
  ).otherwise(
    new Transformation()
      .resize(fill().width(300).height(190))
      .effect(oilPaint())
  )
);
```

```angular
new CloudinaryImage("docs/cappuccino.jpg").conditional(
  ifCondition(
    "w_lte_400",
    new Transformation().resize(fill().width(180).height(220)).adjust(red())
  ).otherwise(
    new Transformation()
      .resize(fill().width(300).height(190))
      .effect(oilPaint())
  )
);
```

```js
new CloudinaryImage("docs/cappuccino.jpg").conditional(
  ifCondition(
    "w_lte_400",
    new Transformation().resize(fill().width(180).height(220)).adjust(red())
  ).otherwise(
    new Transformation()
      .resize(fill().width(300).height(190))
      .effect(oilPaint())
  )
);
```

```python
CloudinaryImage("docs/cappuccino.jpg").image(transformation=[
  {'if': "w_lte_400"},
  {'height': 220, 'width': 180, 'crop': "fill"},
  {'effect': "red"},
  {'if': "else"},
  {'height': 190, 'width': 300, 'crop': "fill"},
  {'effect': "oil_paint"},
  {'if': "end"}
  ])
```

```php
(new ImageTag('docs/cappuccino.jpg'))
	->conditional(Conditional::ifCondition("w_lte_400",(new Transformation())
	->resize(Resize::fill()->width(180)
->height(220))
	->adjust(Adjust::red()))
	->otherwise((new Transformation())
	->resize(Resize::fill()->width(300)
->height(190))
	->effect(Effect::oilPaint()))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .if("w_lte_400").chain()
  .height(220).width(180).crop("fill").chain()
  .effect("red").chain()
  .if("else").chain()
  .height(190).width(300).crop("fill").chain()
  .effect("oil_paint").chain()
  .if("end")).imageTag("docs/cappuccino.jpg");
```

```ruby
cl_image_tag("docs/cappuccino.jpg", transformation: [
  {if: "w_lte_400"},
  {height: 220, width: 180, crop: "fill"},
  {effect: "red"},
  {if: "else"},
  {height: 190, width: 300, crop: "fill"},
  {effect: "oil_paint"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .If("w_lte_400").Chain()
  .Height(220).Width(180).Crop("fill").Chain()
  .Effect("red").Chain()
  .If("else").Chain()
  .Height(190).Width(300).Crop("fill").Chain()
  .Effect("oil_paint").Chain()
  .If("end")).BuildImageTag("docs/cappuccino.jpg")
```

```dart
cloudinary.image('docs/cappuccino.jpg').transformation(Transformation()
	.addTransformation("if_w_lte_400/c_fill,h_220,w_180/e_red/if_else/c_fill,h_190,w_300/e_oil_paint/if_end"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setIf("w_lte_400").chain()
  .setHeight(220).setWidth(180).setCrop("fill").chain()
  .setEffect("red").chain()
  .setIf("else").chain()
  .setHeight(190).setWidth(300).setCrop("fill").chain()
  .setEffect("oil_paint").chain()
  .setIf("end")).generate("docs/cappuccino.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("w_lte_400").chain()
  .height(220).width(180).crop("fill").chain()
  .effect("red").chain()
  .if("else").chain()
  .height(190).width(300).crop("fill").chain()
  .effect("oil_paint").chain()
  .if("end")).generate("docs/cappuccino.jpg");
```

```flutter
cloudinary.image('docs/cappuccino.jpg').transformation(Transformation()
	.addTransformation("if_w_lte_400/c_fill,h_220,w_180/e_red/if_else/c_fill,h_190,w_300/e_oil_paint/if_end"));
```

```kotlin
cloudinary.image {
	publicId("docs/cappuccino.jpg")
	 addTransformation("if_w_lte_400/c_fill,h_220,w_180/e_red/if_else/c_fill,h_190,w_300/e_oil_paint/if_end") 
}.generate()
```

```jquery
$.cloudinary.image("docs/cappuccino.jpg", {transformation: [
  {if: "w_lte_400"},
  {height: 220, width: 180, crop: "fill"},
  {effect: "red"},
  {if: "else"},
  {height: 190, width: 300, crop: "fill"},
  {effect: "oil_paint"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryImage("docs/cappuccino.jpg").conditional(
  ifCondition(
    "w_lte_400",
    new Transformation().resize(fill().width(180).height(220)).adjust(red())
  ).otherwise(
    new Transformation()
      .resize(fill().width(300).height(190))
      .effect(oilPaint())
  )
);
```

## Conditional transformation examples
* **Conditional text overlay based on width**: This example limits an image size to a width of 300 pixels using the `limit` crop mode, and then uses a conditional transformation to add a text caption only to images whose initial width was wider than 300 and were scaled down (`if_iw_gt_300`): 
![Conditional transformation](https://res.cloudinary.com/demo/video/upload/c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Video%20scaled%20down%20to%20300px/fl_layer_apply,g_north_west,x_5,y_5/if_end/marmots.mp4)

```nodejs
cloudinary.video("marmots", {transformation: [
  {width: 300, crop: "limit"},
  {if: "iw_gt_300"},
  {color: "white", overlay: {font_family: "Arial", font_size: 15, font_weight: "bold", text: "Video%20scaled%20down%20to%20300px"}},
  {flags: "layer_apply", gravity: "north_west", x: 5, y: 5},
  {if: "end"}
  ]})
```

```react
new CloudinaryVideo("marmots.mp4")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Video scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```vue
new CloudinaryVideo("marmots.mp4")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Video scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```angular
new CloudinaryVideo("marmots.mp4")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Video scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```js
new CloudinaryVideo("marmots.mp4")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Video scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```python
CloudinaryVideo("marmots").video(transformation=[
  {'width': 300, 'crop': "limit"},
  {'if': "iw_gt_300"},
  {'color': "white", 'overlay': {'font_family': "Arial", 'font_size': 15, 'font_weight': "bold", 'text': "Video%20scaled%20down%20to%20300px"}},
  {'flags': "layer_apply", 'gravity': "north_west", 'x': 5, 'y': 5},
  {'if': "end"}
  ])
```

```php
(new VideoTag('marmots.mp4'))
	->resize(Resize::limitFit()->width(300))
	->conditional(Conditional::ifCondition("initial_width > 300",(new Transformation())
	->overlay(Overlay::source(
	Source::text("Video scaled down to 300px",(new TextStyle("Arial",15))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::WHITE)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
->offsetX(5)
->offsetY(5))
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(300).crop("limit").chain()
  .if("iw_gt_300").chain()
  .color("white").overlay(new TextLayer().fontFamily("Arial").fontSize(15).fontWeight("bold").text("Video%20scaled%20down%20to%20300px")).chain()
  .flags("layer_apply").gravity("north_west").x(5).y(5).chain()
  .if("end")).videoTag("marmots");
```

```ruby
cl_video_tag("marmots", transformation: [
  {width: 300, crop: "limit"},
  {if: "iw_gt_300"},
  {color: "white", overlay: {font_family: "Arial", font_size: 15, font_weight: "bold", text: "Video%20scaled%20down%20to%20300px"}},
  {flags: "layer_apply", gravity: "north_west", x: 5, y: 5},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(300).Crop("limit").Chain()
  .If("iw_gt_300").Chain()
  .Color("white").Overlay(new TextLayer().FontFamily("Arial").FontSize(15).FontWeight("bold").Text("Video%20scaled%20down%20to%20300px")).Chain()
  .Flags("layer_apply").Gravity("north_west").X(5).Y(5).Chain()
  .If("end")).BuildVideoTag("marmots")
```

```dart
cloudinary.video('marmots.mp4').transformation(Transformation()
	.addTransformation("c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Video scaled down to 300px/fl_layer_apply,g_north_west,x_5,y_5/if_end"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(300).setCrop("limit").chain()
  .setIf("iw_gt_300").chain()
  .setColor("white").setOverlay("text:Arial_15_bold:Video%20scaled%20down%20to%20300px").chain()
  .setFlags("layer_apply").setGravity("north_west").setX(5).setY(5).chain()
  .setIf("end")).generate("marmots.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(300).crop("limit").chain()
  .if("iw_gt_300").chain()
  .color("white").overlay(new TextLayer().fontFamily("Arial").fontSize(15).fontWeight("bold").text("Video%20scaled%20down%20to%20300px")).chain()
  .flags("layer_apply").gravity("north_west").x(5).y(5).chain()
  .if("end")).resourceType("video").generate("marmots.mp4");
```

```flutter
cloudinary.video('marmots.mp4').transformation(Transformation()
	.addTransformation("c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Video scaled down to 300px/fl_layer_apply,g_north_west,x_5,y_5/if_end"));
```

```kotlin
cloudinary.video {
	publicId("marmots.mp4")
	 addTransformation("c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Video scaled down to 300px/fl_layer_apply,g_north_west,x_5,y_5/if_end") 
}.generate()
```

```jquery
$.cloudinary.video("marmots", {transformation: [
  {width: 300, crop: "limit"},
  {if: "iw_gt_300"},
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(15).fontWeight("bold").text("Video%20scaled%20down%20to%20300px")},
  {flags: "layer_apply", gravity: "north_west", x: 5, y: 5},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryVideo("marmots.mp4")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Video scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```
![Conditional transformation](https://res.cloudinary.com/demo/image/upload/c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Image%20scaled%20down%20to%20300px/fl_layer_apply,g_north_west,x_5,y_5/if_end/docs/shoes.jpg)

```nodejs
cloudinary.image("docs/shoes.jpg", {transformation: [
  {width: 300, crop: "limit"},
  {if: "iw_gt_300"},
  {color: "white", overlay: {font_family: "Arial", font_size: 15, font_weight: "bold", text: "Image%20scaled%20down%20to%20300px"}},
  {flags: "layer_apply", gravity: "north_west", x: 5, y: 5},
  {if: "end"}
  ]})
```

```react
new CloudinaryImage("docs/shoes.jpg")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Image scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```vue
new CloudinaryImage("docs/shoes.jpg")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Image scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```angular
new CloudinaryImage("docs/shoes.jpg")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Image scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```js
new CloudinaryImage("docs/shoes.jpg")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Image scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

```python
CloudinaryImage("docs/shoes.jpg").image(transformation=[
  {'width': 300, 'crop': "limit"},
  {'if': "iw_gt_300"},
  {'color': "white", 'overlay': {'font_family': "Arial", 'font_size': 15, 'font_weight': "bold", 'text': "Image%20scaled%20down%20to%20300px"}},
  {'flags': "layer_apply", 'gravity': "north_west", 'x': 5, 'y': 5},
  {'if': "end"}
  ])
```

```php
(new ImageTag('docs/shoes.jpg'))
	->resize(Resize::limitFit()->width(300))
	->conditional(Conditional::ifCondition("initial_width > 300",(new Transformation())
	->overlay(Overlay::source(
	Source::text("Image scaled down to 300px",(new TextStyle("Arial",15))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::WHITE)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
->offsetX(5)
->offsetY(5))
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(300).crop("limit").chain()
  .if("iw_gt_300").chain()
  .color("white").overlay(new TextLayer().fontFamily("Arial").fontSize(15).fontWeight("bold").text("Image%20scaled%20down%20to%20300px")).chain()
  .flags("layer_apply").gravity("north_west").x(5).y(5).chain()
  .if("end")).imageTag("docs/shoes.jpg");
```

```ruby
cl_image_tag("docs/shoes.jpg", transformation: [
  {width: 300, crop: "limit"},
  {if: "iw_gt_300"},
  {color: "white", overlay: {font_family: "Arial", font_size: 15, font_weight: "bold", text: "Image%20scaled%20down%20to%20300px"}},
  {flags: "layer_apply", gravity: "north_west", x: 5, y: 5},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(300).Crop("limit").Chain()
  .If("iw_gt_300").Chain()
  .Color("white").Overlay(new TextLayer().FontFamily("Arial").FontSize(15).FontWeight("bold").Text("Image%20scaled%20down%20to%20300px")).Chain()
  .Flags("layer_apply").Gravity("north_west").X(5).Y(5).Chain()
  .If("end")).BuildImageTag("docs/shoes.jpg")
```

```dart
cloudinary.image('docs/shoes.jpg').transformation(Transformation()
	.addTransformation("c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Image scaled down to 300px/fl_layer_apply,g_north_west,x_5,y_5/if_end"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(300).setCrop("limit").chain()
  .setIf("iw_gt_300").chain()
  .setColor("white").setOverlay("text:Arial_15_bold:Image%20scaled%20down%20to%20300px").chain()
  .setFlags("layer_apply").setGravity("north_west").setX(5).setY(5).chain()
  .setIf("end")).generate("docs/shoes.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(300).crop("limit").chain()
  .if("iw_gt_300").chain()
  .color("white").overlay(new TextLayer().fontFamily("Arial").fontSize(15).fontWeight("bold").text("Image%20scaled%20down%20to%20300px")).chain()
  .flags("layer_apply").gravity("north_west").x(5).y(5).chain()
  .if("end")).generate("docs/shoes.jpg");
```

```flutter
cloudinary.image('docs/shoes.jpg').transformation(Transformation()
	.addTransformation("c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Image scaled down to 300px/fl_layer_apply,g_north_west,x_5,y_5/if_end"));
```

```kotlin
cloudinary.image {
	publicId("docs/shoes.jpg")
	 addTransformation("c_limit,w_300/if_iw_gt_300/co_white,l_text:Arial_15_bold:Image scaled down to 300px/fl_layer_apply,g_north_west,x_5,y_5/if_end") 
}.generate()
```

```jquery
$.cloudinary.image("docs/shoes.jpg", {transformation: [
  {width: 300, crop: "limit"},
  {if: "iw_gt_300"},
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(15).fontWeight("bold").text("Image%20scaled%20down%20to%20300px")},
  {flags: "layer_apply", gravity: "north_west", x: 5, y: 5},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryImage("docs/shoes.jpg")
  .resize(limitFit().width(300))
  .conditional(
    ifCondition(
      "initial_width > 300",
      new Transformation().overlay(
        source(
          text(
            "Image scaled down to 300px",
            new TextStyle("Arial", 15).fontWeight("bold")
          ).textColor("white")
        ).position(
          new Position().gravity(compass("north_west")).offsetX(5).offsetY(5)
        )
      )
    )
  );
```

* **Conditional resize based on a contextual metadata value**: This example resizes an image to a 200\*200 square image if it has a contextual metadata key named 'productType' with the value 'shoes'.  
![Crop videos with a specified contextual metadata value](https://res.cloudinary.com/demo/video/upload/if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,w_200/if_end/docs/walking.mp4)

```nodejs
cloudinary.video("docs/walking", {transformation: [
  {if: "ctx:!productType!_eq_!shoes!"},
  {aspect_ratio: "1:1", width: 200, crop: "fill"},
  {if: "end"}
  ]})
```

```react
new CloudinaryVideo("docs/walking.mp4").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(fill().width(200).aspectRatio(ar1X1()))
  )
);
```

```vue
new CloudinaryVideo("docs/walking.mp4").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(fill().width(200).aspectRatio(ar1X1()))
  )
);
```

```angular
new CloudinaryVideo("docs/walking.mp4").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(fill().width(200).aspectRatio(ar1X1()))
  )
);
```

```js
new CloudinaryVideo("docs/walking.mp4").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(fill().width(200).aspectRatio(ar1X1()))
  )
);
```

```python
CloudinaryVideo("docs/walking").video(transformation=[
  {'if': "ctx:!productType!_eq_!shoes!"},
  {'aspect_ratio': "1:1", 'width': 200, 'crop': "fill"},
  {'if': "end"}
  ])
```

```php
(new VideoTag('docs/walking.mp4'))
	->conditional(Conditional::ifCondition("ctx:!productType! = !shoes!",(new Transformation())
	->resize(Resize::fill()->width(200)
	->aspectRatio(
	AspectRatio::ar1X1())
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .if("ctx:!productType!_eq_!shoes!").chain()
  .aspectRatio("1:1").width(200).crop("fill").chain()
  .if("end")).videoTag("docs/walking");
```

```ruby
cl_video_tag("docs/walking", transformation: [
  {if: "ctx:!productType!_eq_!shoes!"},
  {aspect_ratio: "1:1", width: 200, crop: "fill"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .If("ctx:!productType!_eq_!shoes!").Chain()
  .AspectRatio("1:1").Width(200).Crop("fill").Chain()
  .If("end")).BuildVideoTag("docs/walking")
```

```dart
cloudinary.video('docs/walking.mp4').transformation(Transformation()
	.addTransformation("if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,w_200/if_end"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setIf("ctx:!productType!_eq_!shoes!").chain()
  .setAspectRatio("1:1").setWidth(200).setCrop("fill").chain()
  .setIf("end")).generate("docs/walking.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("ctx:!productType!_eq_!shoes!").chain()
  .aspectRatio("1:1").width(200).crop("fill").chain()
  .if("end")).resourceType("video").generate("docs/walking.mp4");
```

```flutter
cloudinary.video('docs/walking.mp4').transformation(Transformation()
	.addTransformation("if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,w_200/if_end"));
```

```kotlin
cloudinary.video {
	publicId("docs/walking.mp4")
	 addTransformation("if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,w_200/if_end") 
}.generate()
```

```jquery
$.cloudinary.video("docs/walking", {transformation: [
  {if: "ctx:!productType!_eq_!shoes!"},
  {aspect_ratio: "1:1", width: 200, crop: "fill"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryVideo("docs/walking.mp4").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(fill().width(200).aspectRatio(ar1X1()))
  )
);
```
![Crop images with a specified contextual metadata value](https://res.cloudinary.com/demo/image/upload/if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,g_auto,w_200/if_end/sunset_shoes.jpg)

```nodejs
cloudinary.image("sunset_shoes.jpg", {transformation: [
  {if: "ctx:!productType!_eq_!shoes!"},
  {aspect_ratio: "1:1", gravity: "auto", width: 200, crop: "fill"},
  {if: "end"}
  ]})
```

```react
new CloudinaryImage("sunset_shoes.jpg").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(
      fill().width(200).aspectRatio(ar1X1()).gravity(autoGravity())
    )
  )
);
```

```vue
new CloudinaryImage("sunset_shoes.jpg").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(
      fill().width(200).aspectRatio(ar1X1()).gravity(autoGravity())
    )
  )
);
```

```angular
new CloudinaryImage("sunset_shoes.jpg").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(
      fill().width(200).aspectRatio(ar1X1()).gravity(autoGravity())
    )
  )
);
```

```js
new CloudinaryImage("sunset_shoes.jpg").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(
      fill().width(200).aspectRatio(ar1X1()).gravity(autoGravity())
    )
  )
);
```

```python
CloudinaryImage("sunset_shoes.jpg").image(transformation=[
  {'if': "ctx:!productType!_eq_!shoes!"},
  {'aspect_ratio': "1:1", 'gravity': "auto", 'width': 200, 'crop': "fill"},
  {'if': "end"}
  ])
```

```php
(new ImageTag('sunset_shoes.jpg'))
	->conditional(Conditional::ifCondition("ctx:!productType! = !shoes!",(new Transformation())
	->resize(Resize::fill()->width(200)
	->aspectRatio(
	AspectRatio::ar1X1())
	->gravity(
	Gravity::autoGravity())
	)));
```

```java
cloudinary.url().transformation(new Transformation()
  .if("ctx:!productType!_eq_!shoes!").chain()
  .aspectRatio("1:1").gravity("auto").width(200).crop("fill").chain()
  .if("end")).imageTag("sunset_shoes.jpg");
```

```ruby
cl_image_tag("sunset_shoes.jpg", transformation: [
  {if: "ctx:!productType!_eq_!shoes!"},
  {aspect_ratio: "1:1", gravity: "auto", width: 200, crop: "fill"},
  {if: "end"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .If("ctx:!productType!_eq_!shoes!").Chain()
  .AspectRatio("1:1").Gravity("auto").Width(200).Crop("fill").Chain()
  .If("end")).BuildImageTag("sunset_shoes.jpg")
```

```dart
cloudinary.image('sunset_shoes.jpg').transformation(Transformation()
	.addTransformation("if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,g_auto,w_200/if_end"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setIf("ctx:!productType!_eq_!shoes!").chain()
  .setAspectRatio("1:1").setGravity("auto").setWidth(200).setCrop("fill").chain()
  .setIf("end")).generate("sunset_shoes.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("ctx:!productType!_eq_!shoes!").chain()
  .aspectRatio("1:1").gravity("auto").width(200).crop("fill").chain()
  .if("end")).generate("sunset_shoes.jpg");
```

```flutter
cloudinary.image('sunset_shoes.jpg').transformation(Transformation()
	.addTransformation("if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,g_auto,w_200/if_end"));
```

```kotlin
cloudinary.image {
	publicId("sunset_shoes.jpg")
	 addTransformation("if_ctx:!productType!_eq_!shoes!/ar_1:1,c_fill,g_auto,w_200/if_end") 
}.generate()
```

```jquery
$.cloudinary.image("sunset_shoes.jpg", {transformation: [
  {if: "ctx:!productType!_eq_!shoes!"},
  {aspect_ratio: "1:1", gravity: "auto", width: 200, crop: "fill"},
  {if: "end"}
  ]})
```

```react_native
new CloudinaryImage("sunset_shoes.jpg").conditional(
  ifCondition(
    "ctx:!productType! = !shoes!",
    new Transformation().resize(
      fill().width(200).aspectRatio(ar1X1()).gravity(autoGravity())
    )
  )
);
```

* **Conditional image overlay based on tags**: This example adds a sale icon to a product image if both the strings 'sale' and 'in_stock' are among the tags assigned to the image:
![product with conditional sale icon ](https://res.cloudinary.com/demo/video/upload/if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300/docs/sunglasses.mp4)

```nodejs
cloudinary.video("docs/sunglasses", {transformation: [
  {if: "!sale:in_stock!_in_tags"},
  {overlay: "sale_icon"},
  {width: 200, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30},
  {if: "end"},
  {width: 300, crop: "scale"}
  ]})
```

```react
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```vue
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```angular
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```js
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```python
CloudinaryVideo("docs/sunglasses").video(transformation=[
  {'if': "!sale:in_stock!_in_tags"},
  {'overlay': "sale_icon"},
  {'width': 200, 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "north_west", 'x': 30, 'y': 30},
  {'if': "end"},
  {'width': 300, 'crop': "scale"}
  ])
```

```php
(new VideoTag('docs/sunglasses.mp4'))
	->conditional(Conditional::ifCondition("!sale:in_stock! in tags",(new Transformation())
	->overlay(Overlay::source(
	Source::image("sale_icon")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(200)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
->offsetX(30)
->offsetY(30))
	)))
	->resize(Resize::scale()->width(300));
```

```java
cloudinary.url().transformation(new Transformation()
  .if("!sale:in_stock!_in_tags").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(200).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30).chain()
  .if("end").chain()
  .width(300).crop("scale")).videoTag("docs/sunglasses");
```

```ruby
cl_video_tag("docs/sunglasses", transformation: [
  {if: "!sale:in_stock!_in_tags"},
  {overlay: "sale_icon"},
  {width: 200, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30},
  {if: "end"},
  {width: 300, crop: "scale"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .If("!sale:in_stock!_in_tags").Chain()
  .Overlay(new Layer().PublicId("sale_icon")).Chain()
  .Width(200).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("north_west").X(30).Y(30).Chain()
  .If("end").Chain()
  .Width(300).Crop("scale")).BuildVideoTag("docs/sunglasses")
```

```dart
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.addTransformation("if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setIf("!sale:in_stock!_in_tags").chain()
  .setOverlay("sale_icon").chain()
  .setWidth(200).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("north_west").setX(30).setY(30).chain()
  .setIf("end").chain()
  .setWidth(300).setCrop("scale")).generate("docs/sunglasses.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("!sale:in_stock!_in_tags").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(200).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30).chain()
  .if("end").chain()
  .width(300).crop("scale")).resourceType("video").generate("docs/sunglasses.mp4");
```

```flutter
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.addTransformation("if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300"));
```

```kotlin
cloudinary.video {
	publicId("docs/sunglasses.mp4")
	 addTransformation("if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300") 
}.generate()
```

```jquery
$.cloudinary.video("docs/sunglasses", {transformation: [
  {if: "!sale:in_stock!_in_tags"},
  {overlay: new cloudinary.Layer().publicId("sale_icon")},
  {width: 200, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30},
  {if: "end"},
  {width: 300, crop: "scale"}
  ]})
```

```react_native
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```
![product with conditional sale icon ](https://res.cloudinary.com/demo/image/upload/if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_180/fl_layer_apply,g_south_east,x_30,y_30/if_end/c_scale,w_250/backpack.jpg)

```nodejs
cloudinary.image("backpack.jpg", {transformation: [
  {if: "!sale:in_stock!_in_tags"},
  {overlay: "sale_icon"},
  {width: 180, crop: "scale"},
  {flags: "layer_apply", gravity: "south_east", x: 30, y: 30},
  {if: "end"},
  {width: 250, crop: "scale"}
  ]})
```

```react
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("south_east")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```vue
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("south_east")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```angular
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("south_east")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```js
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("south_east")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```python
CloudinaryImage("backpack.jpg").image(transformation=[
  {'if': "!sale:in_stock!_in_tags"},
  {'overlay': "sale_icon"},
  {'width': 180, 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "south_east", 'x': 30, 'y': 30},
  {'if': "end"},
  {'width': 250, 'crop': "scale"}
  ])
```

```php
(new ImageTag('backpack.jpg'))
	->conditional(Conditional::ifCondition("!sale:in_stock! in tags",(new Transformation())
	->overlay(Overlay::source(
	Source::image("sale_icon")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(180)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::southEast()))
->offsetX(30)
->offsetY(30))
	)))
	->resize(Resize::scale()->width(250));
```

```java
cloudinary.url().transformation(new Transformation()
  .if("!sale:in_stock!_in_tags").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(180).crop("scale").chain()
  .flags("layer_apply").gravity("south_east").x(30).y(30).chain()
  .if("end").chain()
  .width(250).crop("scale")).imageTag("backpack.jpg");
```

```ruby
cl_image_tag("backpack.jpg", transformation: [
  {if: "!sale:in_stock!_in_tags"},
  {overlay: "sale_icon"},
  {width: 180, crop: "scale"},
  {flags: "layer_apply", gravity: "south_east", x: 30, y: 30},
  {if: "end"},
  {width: 250, crop: "scale"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .If("!sale:in_stock!_in_tags").Chain()
  .Overlay(new Layer().PublicId("sale_icon")).Chain()
  .Width(180).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("south_east").X(30).Y(30).Chain()
  .If("end").Chain()
  .Width(250).Crop("scale")).BuildImageTag("backpack.jpg")
```

```dart
cloudinary.image('backpack.jpg').transformation(Transformation()
	.addTransformation("if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_180/fl_layer_apply,g_south_east,x_30,y_30/if_end/c_scale,w_250"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setIf("!sale:in_stock!_in_tags").chain()
  .setOverlay("sale_icon").chain()
  .setWidth(180).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("south_east").setX(30).setY(30).chain()
  .setIf("end").chain()
  .setWidth(250).setCrop("scale")).generate("backpack.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("!sale:in_stock!_in_tags").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(180).crop("scale").chain()
  .flags("layer_apply").gravity("south_east").x(30).y(30).chain()
  .if("end").chain()
  .width(250).crop("scale")).generate("backpack.jpg");
```

```flutter
cloudinary.image('backpack.jpg').transformation(Transformation()
	.addTransformation("if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_180/fl_layer_apply,g_south_east,x_30,y_30/if_end/c_scale,w_250"));
```

```kotlin
cloudinary.image {
	publicId("backpack.jpg")
	 addTransformation("if_!sale:in_stock!_in_tags/l_sale_icon/c_scale,w_180/fl_layer_apply,g_south_east,x_30,y_30/if_end/c_scale,w_250") 
}.generate()
```

```jquery
$.cloudinary.image("backpack.jpg", {transformation: [
  {if: "!sale:in_stock!_in_tags"},
  {overlay: new cloudinary.Layer().publicId("sale_icon")},
  {width: 180, crop: "scale"},
  {flags: "layer_apply", gravity: "south_east", x: 30, y: 30},
  {if: "end"},
  {width: 250, crop: "scale"}
  ]})
```

```react_native
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "!sale:in_stock! in tags",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("south_east")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(250));
```

* **Conditional image overlay based on structured metadata value**: This example adds a sale icon to a product image if the stock level of the product is less than 50 (as determined by the value of the numeric structured metadata field with external ID, `stock-level`, here set as 30):
![product with conditional sale icon based on stock level](https://res.cloudinary.com/demo/video/upload/if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300/docs/sunglasses.mp4)

```nodejs
cloudinary.video("docs/sunglasses", {transformation: [
  {if: "md:!stock-level!_lt_50"},
  {overlay: "sale_icon"},
  {width: 200, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30},
  {if: "end"},
  {width: 300, crop: "scale"}
  ]})
```

```react
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```vue
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```angular
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```js
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```

```python
CloudinaryVideo("docs/sunglasses").video(transformation=[
  {'if': "md:!stock-level!_lt_50"},
  {'overlay': "sale_icon"},
  {'width': 200, 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "north_west", 'x': 30, 'y': 30},
  {'if': "end"},
  {'width': 300, 'crop': "scale"}
  ])
```

```php
(new VideoTag('docs/sunglasses.mp4'))
	->conditional(Conditional::ifCondition("md:!stock-level! < 50",(new Transformation())
	->overlay(Overlay::source(
	Source::image("sale_icon")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(200)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
->offsetX(30)
->offsetY(30))
	)))
	->resize(Resize::scale()->width(300));
```

```java
cloudinary.url().transformation(new Transformation()
  .if("md:!stock-level!_lt_50").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(200).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30).chain()
  .if("end").chain()
  .width(300).crop("scale")).videoTag("docs/sunglasses");
```

```ruby
cl_video_tag("docs/sunglasses", transformation: [
  {if: "md:!stock-level!_lt_50"},
  {overlay: "sale_icon"},
  {width: 200, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30},
  {if: "end"},
  {width: 300, crop: "scale"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .If("md:!stock-level!_lt_50").Chain()
  .Overlay(new Layer().PublicId("sale_icon")).Chain()
  .Width(200).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("north_west").X(30).Y(30).Chain()
  .If("end").Chain()
  .Width(300).Crop("scale")).BuildVideoTag("docs/sunglasses")
```

```dart
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.addTransformation("if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setIf("md:!stock-level!_lt_50").chain()
  .setOverlay("sale_icon").chain()
  .setWidth(200).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("north_west").setX(30).setY(30).chain()
  .setIf("end").chain()
  .setWidth(300).setCrop("scale")).generate("docs/sunglasses.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("md:!stock-level!_lt_50").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(200).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30).chain()
  .if("end").chain()
  .width(300).crop("scale")).resourceType("video").generate("docs/sunglasses.mp4");
```

```flutter
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.addTransformation("if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300"));
```

```kotlin
cloudinary.video {
	publicId("docs/sunglasses.mp4")
	 addTransformation("if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_200/fl_layer_apply,g_north_west,x_30,y_30/if_end/c_scale,w_300") 
}.generate()
```

```jquery
$.cloudinary.video("docs/sunglasses", {transformation: [
  {if: "md:!stock-level!_lt_50"},
  {overlay: new cloudinary.Layer().publicId("sale_icon")},
  {width: 200, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30},
  {if: "end"},
  {width: 300, crop: "scale"}
  ]})
```

```react_native
new CloudinaryVideo("docs/sunglasses.mp4")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(200))
          )
        ).position(
          new Position().gravity(compass("north_west")).offsetX(30).offsetY(30)
        )
      )
    )
  )
  .resize(scale().width(300));
```
![Product with conditional sale icon based on stock level](https://res.cloudinary.com/demo/image/upload/if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_180/fl_layer_apply,g_north_east,y_20,x_20/if_end/c_scale,w_250/backpack.jpg)

```nodejs
cloudinary.image("backpack.jpg", {transformation: [
  {if: "md:!stock-level!_lt_50"},
  {overlay: "sale_icon"},
  {width: 180, crop: "scale"},
  {flags: "layer_apply", gravity: "north_east", y: 20, x: 20},
  {if: "end"},
  {width: 250, crop: "scale"}
  ]})
```

```react
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("north_east")).offsetX(20).offsetY(20)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```vue
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("north_east")).offsetX(20).offsetY(20)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```angular
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("north_east")).offsetX(20).offsetY(20)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```js
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("north_east")).offsetX(20).offsetY(20)
        )
      )
    )
  )
  .resize(scale().width(250));
```

```python
CloudinaryImage("backpack.jpg").image(transformation=[
  {'if': "md:!stock-level!_lt_50"},
  {'overlay': "sale_icon"},
  {'width': 180, 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "north_east", 'y': 20, 'x': 20},
  {'if': "end"},
  {'width': 250, 'crop': "scale"}
  ])
```

```php
(new ImageTag('backpack.jpg'))
	->conditional(Conditional::ifCondition("md:!stock-level! < 50",(new Transformation())
	->overlay(Overlay::source(
	Source::image("sale_icon")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(180)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
->offsetX(20)
->offsetY(20))
	)))
	->resize(Resize::scale()->width(250));
```

```java
cloudinary.url().transformation(new Transformation()
  .if("md:!stock-level!_lt_50").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(180).crop("scale").chain()
  .flags("layer_apply").gravity("north_east").y(20).x(20).chain()
  .if("end").chain()
  .width(250).crop("scale")).imageTag("backpack.jpg");
```

```ruby
cl_image_tag("backpack.jpg", transformation: [
  {if: "md:!stock-level!_lt_50"},
  {overlay: "sale_icon"},
  {width: 180, crop: "scale"},
  {flags: "layer_apply", gravity: "north_east", y: 20, x: 20},
  {if: "end"},
  {width: 250, crop: "scale"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .If("md:!stock-level!_lt_50").Chain()
  .Overlay(new Layer().PublicId("sale_icon")).Chain()
  .Width(180).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("north_east").Y(20).X(20).Chain()
  .If("end").Chain()
  .Width(250).Crop("scale")).BuildImageTag("backpack.jpg")
```

```dart
cloudinary.image('backpack.jpg').transformation(Transformation()
	.addTransformation("if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_180/fl_layer_apply,g_north_east,y_20,x_20/if_end/c_scale,w_250"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setIf("md:!stock-level!_lt_50").chain()
  .setOverlay("sale_icon").chain()
  .setWidth(180).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("north_east").setY(20).setX(20).chain()
  .setIf("end").chain()
  .setWidth(250).setCrop("scale")).generate("backpack.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .if("md:!stock-level!_lt_50").chain()
  .overlay(new Layer().publicId("sale_icon")).chain()
  .width(180).crop("scale").chain()
  .flags("layer_apply").gravity("north_east").y(20).x(20).chain()
  .if("end").chain()
  .width(250).crop("scale")).generate("backpack.jpg");
```

```flutter
cloudinary.image('backpack.jpg').transformation(Transformation()
	.addTransformation("if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_180/fl_layer_apply,g_north_east,y_20,x_20/if_end/c_scale,w_250"));
```

```kotlin
cloudinary.image {
	publicId("backpack.jpg")
	 addTransformation("if_md:!stock-level!_lt_50/l_sale_icon/c_scale,w_180/fl_layer_apply,g_north_east,y_20,x_20/if_end/c_scale,w_250") 
}.generate()
```

```jquery
$.cloudinary.image("backpack.jpg", {transformation: [
  {if: "md:!stock-level!_lt_50"},
  {overlay: new cloudinary.Layer().publicId("sale_icon")},
  {width: 180, crop: "scale"},
  {flags: "layer_apply", gravity: "north_east", y: 20, x: 20},
  {if: "end"},
  {width: 250, crop: "scale"}
  ]})
```

```react_native
new CloudinaryImage("backpack.jpg")
  .conditional(
    ifCondition(
      "md:!stock-level! < 50",
      new Transformation().overlay(
        source(
          image("sale_icon").transformation(
            new Transformation().resize(scale().width(180))
          )
        ).position(
          new Position().gravity(compass("north_east")).offsetX(20).offsetY(20)
        )
      )
    )
  )
  .resize(scale().width(250));
```

 &nbsp;
* **Conditional cropping mode based on illustration score**: This example ensures that uploaded graphics such as logos are never cut off, even if the art design significantly changes the required aspect ratio of the delivered image. Using the same transformation, photos can be scaled and cropped to completely fill the full space available. Using the `ils` conditional characteristic for both URLs below, the `cloudinary_icon_blue` logo is resized to the required portrait size to using the `pad` method, while the `flower_shop` photo is resized to the same aspect ratio using the `fill` method:
![icon with conditional pad cropping](https://res.cloudinary.com/demo/image/upload/if_ils_gt_0.5/b_lightgray,c_pad,h_200,w_150/if_else/c_fill,h_200,w_150/if_end/cloudinary_icon_blue.jpg )
![photo with conditional fill cropping](https://res.cloudinary.com/demo/image/upload/if_ils_gt_0.5/b_lightgray,c_pad,h_200,w_150/if_else/c_fill,h_200,w_150/if_end/docs/flower_shop.jpg )

> **NOTE**:
>
> When you use variable or conditional expressions that include the `tags`, `ctx` or `md` parameters, their values are exposed publicly in the URL. If you want to prevent such values from being exposed, you can disable the **Usage of tags/context/metadata in transformation URLs** option in the **Security** Settings (enabled by default). When this setting is disabled, any URL that exposes tags, contextual metadata or structured metadata values will return an error.
