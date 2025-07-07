import { useState } from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form, notification, Upload } from 'antd';
import { uploadFileAPI } from 'services/file.service';
import type { IconType } from 'antd/es/notification/interface';
import type { UploadProps } from 'antd/lib';
import type { RcFile } from 'antd/es/upload';
import { UploadOutlined } from "@ant-design/icons";
import type { ICreateVideo } from 'types/video.type';
import { createVideoAPI } from 'services/video.service';

interface CreateVideoModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateVideoModal = ({ open, onClose, onFinish, categoryId }: CreateVideoModalProps) => {
    const [form] = Form.useForm<ICreateVideo>();
    const [loadingSubtitle, setLoadingSubtitle] = useState(false);
    const [subTitleName, setSubtitleName] = useState<string>();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Create video',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleFinish = async (values: ICreateVideo
    ) => {
        if (!categoryId) {
            openNotification(true, 'Please select a category.', 'error')();
            return false;
        }
        const dataToSubmit = { ...values, categoryId };

        try {
            const res = await createVideoAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                openNotification(true, res.message || 'Video created successfully!', 'success')();
                onFinish();
                return true;
            } else {
                openNotification(true, res.message || 'Failed to create Video.', 'error')();
                return false;
            }
        } catch (error) {
            openNotification(true, 'An error occurred while creating Video.', 'error')();
            return false;
        }
    };

    const handleAudioUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        setLoadingSubtitle(true);
        try {
            const res = await uploadFileAPI(file as RcFile);
            if (res && res.data) {
                form.setFieldsValue({ subtitle: res.data.fileUrl });
                setSubtitleName((file as RcFile).name);
                if (onSuccess) onSuccess('ok');
            } else { if (onError) onError(new Error(res.message || 'Upload failed')); }
        } catch (error) { if (onError) onError(error as Error); }
        finally { setLoadingSubtitle(false); }
    };

    return (
        <>
            <ModalForm
                title="Create a new Video"
                form={form}
                open={open}
                onFinish={handleFinish}
                onOpenChange={(visible) => {
                    if (!visible) {
                        form.resetFields();
                        setSubtitleName(undefined);
                        onClose();
                    }
                }}
                modalProps={{ destroyOnClose: true, width: '60vw' }}
            >
                <ProFormText name="title" label="Video Title" rules={[{ required: true }]} />
                <ProFormText name="url" label="Url" rules={[{ required: true }]} />
                <ProFormTextArea name="description" label="Description"
                    rules={[{ required: true, message: 'Please enter description!' }]} />
                <Form.Item label="SubTitle File">
                    <Upload name="subtitle" customRequest={handleAudioUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} loading={loadingSubtitle}>Click to Upload</Button>
                    </Upload>
                    {subTitleName && <span style={{ marginLeft: '10px' }}>{subTitleName}</span>}
                </Form.Item>

                <ProFormText name="subtitle" hidden />
            </ModalForm>
            {contextHolder}
        </>
    );
};

export default CreateVideoModal;