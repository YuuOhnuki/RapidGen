"use client";

import React, { useRef, useEffect } from 'react';
import { Upload, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type UploadBoxProps = {
  onFiles: (files: FileList) => void;
  initialPreview?: string | null;
  onClear?: () => void;
};

export const UploadBox: React.FC<UploadBoxProps> = ({ onFiles }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const openFileDialog = () => inputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = e.dataTransfer.files;
        const file = files[0];
        // validation
        const maxBytes = 5 * 1024 * 1024; // 5MB
        if (!file.type.startsWith('image/')) {
          setError('画像ファイルを選択してください。');
          return;
        }
        if (file.size > maxBytes) {
          setError('ファイルサイズは5MB以下にしてください。');
          return;
        }
        setError(null);
        onFiles(files);
        if (file) {
          const url = URL.createObjectURL(file);
          setPreview(url);
        }
        e.dataTransfer.clearData();
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      const file = files[0];
      const maxBytes = 5 * 1024 * 1024; // 5MB
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルを選択してください。');
        return;
      }
      if (file.size > maxBytes) {
        setError('ファイルサイズは5MB以下にしてください。');
        return;
      }
      setError(null);
      onFiles(files);
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div
      className={`w-full rounded-lg p-8 border-2 border-dashed transition-colors duration-150 ${
        isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'
      }`}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') openFileDialog();
      }}
    >
        <div className="flex flex-col items-center justify-center gap-3">
          {preview ? (
            <div className="w-48 h-48 rounded-md overflow-hidden border">
              {/* next/image warns for object URLs; using native img is acceptable here */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <>
              <Upload className="text-gray-500" size={36} />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">画像をドラッグ＆ドロップ</p>
                <p className="text-sm text-gray-500">または下のボタンから選択してください</p>
              </div>
            </>
          )}

          <div className="pt-2 flex items-center gap-2">
            <Button onClick={openFileDialog}>{preview ? '別のファイルを選択' : 'ファイルを選択'}</Button>
            {preview && (
              <Button
                onClick={() => {
                  if (preview) {
                    URL.revokeObjectURL(preview);
                    setPreview(null);
                    if (inputRef.current) {
                      inputRef.current.value = '';
                    }
                  }
                }}
                variant="ghost"
                className="text-red-600"
              >
                <Trash size={16} />
              </Button>
            )}
          </div>

          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

          <Input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
    </div>
  );
};

export default UploadBox;
