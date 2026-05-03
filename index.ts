const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true,
});

console.log(cloudinary.config());

const uploadImage = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

const getAssetInfo = async (publicId) => {
  const options = {
    colors: true,
  };

  try {
    const result = await cloudinary.api.resource(publicId, options);
    console.log(result);
    return result.colors;
  } catch (error) {
    console.error(error);
  }
};

const createImageTag = (publicId, ...colors) => {
  const [effectColor, backgroundColor] = colors;

  let imageTag = cloudinary.url(publicId, {
    transformation: [
      { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
      { radius: 'max' },
      { effect: 'outline:10', color: effectColor },
      { background: backgroundColor },
    ],
  });

  return imageTag;
};

(async () => {
  const imagePath =
    'https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg';

  const publicId = await uploadImage(imagePath);

  const colors = await getAssetInfo(publicId);

  const imageTag = await createImageTag(publicId, colors[0][0], colors[1][0]);

  console.log(imageTag);
})();
