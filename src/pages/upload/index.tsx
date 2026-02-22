import type { ReactElement, ChangeEvent, DragEvent, MouseEvent } from 'react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import styles from './upload.module.scss'
import { catApi } from '../../features/cats/api/catApi'
import cat from '../../assets/images/cat.svg'

const MAX_SIZE = 5 * 1024 * 1024

const Upload = (): ReactElement => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()

  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFile = (selected: File | null) => {
    setError(null)

    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    if (selected.size > MAX_SIZE) {
      setError('Image must be under 5MB.')
      return
    }

    setFile(selected)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleFile(e.dataTransfer.files?.[0] ?? null)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleUploaderClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isSubmitting) return

    const target = e.target as HTMLElement
    if (target.closest('button')) return

    inputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image first.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await catApi.upload(file)
      await queryClient.invalidateQueries({ queryKey: ['cats', 'my-images'] })
      await queryClient.refetchQueries({ queryKey: ['cats', 'my-images'] })
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.uploader}
        onClick={handleUploaderClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <h2>Upload</h2>

        <div className={`${styles.dropZone}`}>
          <img src={cat} alt="" className={styles.catIllustration} />
          <p>{file ? file.name : 'Drag & drop a cat image, or click anywhere to select'}</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />

        <p className={styles.error}>{error ?? ' '}</p>

        <button onClick={handleSubmit} disabled={!file || isSubmitting}>
          {isSubmitting ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export default Upload
