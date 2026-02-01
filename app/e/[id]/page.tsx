'use client'
import styles from './Post.module.scss'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { apiService } from '@/services/api'


const PostPage = () => {

  const { id } = useParams()
  console.log(id)

  useEffect(() => {
    const fetchPost = async () => {
      const response = await apiService.get(`/api/v1/landing/posts/${id}`)
      console.log(response)
    }
    fetchPost()
  }, [id])

  return (
    <div className={styles.post}>
      <h1>Post - {id}</h1>
    </div>
  )
}

export default PostPage