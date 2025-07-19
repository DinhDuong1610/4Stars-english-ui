import { useState } from 'react';
import { Card, Avatar, Typography, Space, Button, Image, Dropdown, Menu, message } from 'antd';
import { LikeOutlined, LikeFilled, CommentOutlined, MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { IPost } from 'types/post.type';
import { useAuthStore } from 'stores/auth.store';
import { deletePostAPI, likePostAPI, unlikePostAPI } from 'services/post.service';
import CommentSection from './comment-section.component';
import styles from 'pages/client/community/community.page.module.scss';

const { Text } = Typography;

interface PostCardProps {
    post: IPost;
    onDelete: (postId: number) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [commentCount, setCommentCount] = useState(post.commentCount);

    const images = post.attachments.filter(att => att.fileType === 'IMAGE');
    const imageCount = images.length;
    const imagesToShow = images.slice(0, 4);

    const handleLike = (id: number) => {
        if (!user) return;

        if (isLiked) {
            try {
                unlikePostAPI(id);
            } catch (error) {
                message.error(t('errors.unlikePostError'));
            }
        } else {
            try {
                likePostAPI(id);
            } catch (error) {
                message.error(t('errors.likePostError'));
            }
        }

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleCommentPostUpdate = () => {
        setCommentCount(prev => prev + 1);
    }

    const handleCommentDeleteUpdate = (count: number) => {
        setCommentCount(prev => prev - count);
    }

    const handleDelete = async () => {
        try {
            await deletePostAPI(post.id);
            message.success(t('community.deletePostSuccess'));
            onDelete(post.id);
        } catch (error) {
            message.error(t('errors.deletePostError'));
        }
    };

    const menu = (
        <Menu>
            {user?.id === post.user.id && (
                <Menu.Item key="delete" danger onClick={handleDelete}>
                    <DeleteOutlined /> {t('common.delete')}
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <Card className={styles.postCard}>
            <div className={styles.postHeader}>
                <div className={styles.postAuthorWrapper}>
                    <Avatar>{post.user.name.charAt(0)}</Avatar>
                    <div className={styles.postAuthor}>
                        <Text className={styles.postAuthorName}>{post.user.name}</Text>
                        <Text className={styles.postAuthorTime} type="secondary">{dayjs(post.createdAt).fromNow()}</Text>
                    </div>
                </div>
                {
                    user?.id === post.user.id && (
                        <Dropdown className={styles.postDropdown} overlay={menu} placement="bottomRight">
                            <Button type="text" icon={<MoreOutlined size={20} style={{ transform: 'rotate(90deg)' }} />} />
                        </Dropdown>
                    )
                }
            </div>

            <p className={styles.postCaption}>{post.caption}</p>

            {imageCount > 0 && (
                <Image.PreviewGroup>
                    <div
                        className={styles.attachmentsGrid}
                        data-count={imageCount > 4 ? 4 : imageCount}
                    >
                        {imagesToShow.map((att, index) => (
                            <div key={att.id} className={styles.imageWrapper}>
                                <Image src={`${import.meta.env.VITE_BACKEND_URL}${att.fileUrl}`} />

                                {imageCount > 4 && index === 3 && (
                                    <div className={styles.overlay}>
                                        <Typography.Text style={{ color: 'white', fontSize: 24 }}>
                                            +{imageCount - 4}
                                        </Typography.Text>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Image.PreviewGroup>
            )}

            <div className={styles.postStats}>
                <Text type="secondary">{likeCount} {t('community.likes')}</Text>
                <Text type="secondary">{commentCount} {t('community.comments')}</Text>
            </div>

            <div className={styles.postActions}>
                <Button type="text" icon={isLiked ? <LikeFilled /> : <LikeOutlined />} onClick={() => handleLike(post.id)}>
                    {t('community.like')}
                </Button>
                <Button type="text" icon={<CommentOutlined />} onClick={() => setShowComments(!showComments)}>
                    {t('community.comment')}
                </Button>
            </div>

            {showComments && <CommentSection postId={post.id} onCommentPosted={handleCommentPostUpdate} onCommentDeleted={handleCommentDeleteUpdate} />}
        </Card>
    );
};

export default PostCard;
