'use client';
import {faSpinner, faUser, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import {ChangeEvent, useRef, useState} from "react";

export default function ImageUpload({
  name,icon,defaultValue='',
}:{
  name:string;
  icon:IconDefinition;
  defaultValue:string;
}) {
  const fileInRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [url, setUrl] = useState(defaultValue);

  async function upload(ev:ChangeEvent<HTMLInputElement>) {
    const input = ev.target as HTMLInputElement;
    if (input && input.files?.length && input.files.length > 0) {
      setIsUploading(true);
      const file = input.files[0];
      const data = new FormData;
      data.set('file', file);
      const response = await axios.post('/api/upload', data);
      if (response.data.url) {
        setUrl(response.data.url);
        setIsUploading(false);
        setIsImageLoading(true);
      }
    }
  }

  const imgLoading = (isUploading || isImageLoading);

  return (
    <>
      <div className="bg-gray-100 rounded-md size-24 inline-flex items-center content-center justify-center">
        {imgLoading && (
          <FontAwesomeIcon icon={faSpinner} className="text-gray-400 animate-spin"/>
        )}
        {(!isUploading) && url && (
          <Image src={url} alt={'uploaded image'} width={1024} height={1024}
                 onLoadingComplete={() => setIsImageLoading(false)}
                 className="w-auto h-auto max-w-24 max-h-24" />
        )}
        {!imgLoading && !url && (
          <FontAwesomeIcon icon={icon} className="text-gray-400"/>
        )}
      </div>
      <input type="hidden" value={url} name={name} />
      <div className="mt-2">
        <input
          onChange={ev => upload(ev)}
          ref={fileInRef}
          type="file"
          className="hidden"/>
        <Button
          type="button"
          onClick={() => fileInRef.current?.click()}
          variant="soft">
          select file
        </Button>
      </div>
    </>
  );
}