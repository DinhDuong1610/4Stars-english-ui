import { Image, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styles from './video-card.module.scss';
import { formatISODate } from 'utils/format.util';
import type { IVideo } from 'types/video.type';

const { Title, Paragraph } = Typography;

interface VideoCardProps {
    video: IVideo;
}

const VideoCard = ({ video }: VideoCardProps) => {

    return (
        <Link to={`/videos/${video.id}`}>
            <div className={styles.videoCard}>
                {/* <Image className={styles.cardImage} width="100%" preview={false} height={150} src={`${import.meta.env.VITE_BACKEND_URL}${video.image}`} /> */}
                <Title ellipsis={{ rows: 2 }} level={5} className={styles.cardTitle}>{video.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }} className={styles.cardDesc}>
                    {video.description}
                </Paragraph>
                <Paragraph className={styles.cardTime}>{formatISODate(video.createdAt)}</Paragraph>
            </div>
        </Link>
    );
};

export default VideoCard;
