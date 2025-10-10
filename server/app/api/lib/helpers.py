import cloudinary
from dotenv import load_dotenv
import cloudinary.uploader
import cloudinary.api
import os
from ..exceptions.exceptions import MissingVariables

import uuid

load_dotenv()

cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME')
cloud_key=os.getenv('CLOUDINARY_API_KEY')
cloud_api_secret=os.getenv('CLOUDINARY_API_SECRET')

if not cloud_name or not cloud_key or not cloud_api_secret:
    raise MissingVariables('Incomplete environment variables')


config = cloudinary.config(
    cloud_name=cloud_name,
    api_key=cloud_key,
    api_secret=cloud_api_secret,
    secure=True,
    )


def to_uuid4(id: str) -> uuid.UUID:
    return uuid.UUID(id, version=4)


async def upload_image_to_cloudinary(file: bytes, user_firstname, user_lastname) -> str | None:
    user_name = user_firstname + user_lastname
    try:
        response = cloudinary.uploader.upload(
            file,
             use_filename=True,
             tags=['profile_pictures'],
             context={
                 'department': 'profile',
                 'user': user_name
             }
        )
        return response['secure_url']
    except:
        return

