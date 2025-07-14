import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Card, Button, message, Checkbox, Divider, Select, Input, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { createQuizAPI } from 'services/quiz.service';
import type { ICreateQuiz } from 'types/quiz.type';

interface CreateQuizModalProps {
    open: boolean;
    onClose: () => void;
    onFinish: () => void;
    categoryId: number | null;
}

const CreateQuizModal = ({ open, onClose, onFinish, categoryId }: CreateQuizModalProps) => {
    const [form] = Form.useForm<ICreateQuiz>();

    const handleFinish = async (values: ICreateQuiz) => {
        if (!categoryId) {
            message.error("Category not selected!");
            return false;
        }

        const dataToSubmit = { ...values, categoryId };

        try {
            const res = await createQuizAPI(dataToSubmit);
            if (res && res.statusCode === 201) {
                message.success("Quiz created successfully!");
                onFinish();
                return true;
            } else {
                message.error(res.message || "Failed to create quiz.");
                return false;
            }
        } catch (error) {
            message.error("An error occurred.");
            return false;
        }
    };

    return (
        <ModalForm
            title="Create a New Quiz"
            form={form}
            open={open}
            onFinish={handleFinish}
            onOpenChange={(visible) => !visible && onClose()}
            modalProps={{ destroyOnClose: true, width: '70vw' }}
        >
            <ProFormText name="title" label="Quiz Title" rules={[{ required: true }]} />
            <ProFormTextArea name="description" label="Description" />

            <Divider>Questions</Divider>

            <Form.List name="questions">
                {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card key={key} title={`Question ${name + 1}`}
                                extra={<Button icon={<DeleteOutlined />} type="text" danger onClick={() => remove(name)} />}
                            >
                                <Form.Item
                                    {...restField}
                                    label="Question Type"
                                    name={[name, 'questionType']}
                                    rules={[{ required: true }]}
                                >
                                    <Select options={[
                                        { label: 'Fill in the Blank', value: 'FILL_IN_BLANK' },
                                        { label: 'Listening Comprehension', value: 'LISTENING_COMPREHENSION' },
                                        { label: 'Multiple Choice (Image)', value: 'MULTIPLE_CHOICE_IMAGE' },
                                        { label: 'Multiple Choice (Text)', value: 'MULTIPLE_CHOICE_TEXT' },
                                    ]} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    label="Prompt"
                                    name={[name, 'prompt']}
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea rows={2} />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Text to Fill"
                                    name={[name, 'textToFill']}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Correct Sentence"
                                    name={[name, 'correctSentence']}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Audio URL"
                                    name={[name, 'audioUrl']}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Image URL"
                                    name={[name, 'imageUrl']}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Points"
                                    name={[name, 'points']}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    label="Question Order"
                                    name={[name, 'questionOrder']}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Choices">
                                    <Form.List name={[name, 'choices']}>
                                        {(subFields, { add: addChoice, remove: removeChoice }) => (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {subFields.map(({ key: subKey, name: subName, ...restSubField }) => (
                                                    <Space key={subKey} align="baseline">
                                                        <Form.Item
                                                            {...restSubField}
                                                            name={[subName, 'content']}
                                                        >
                                                            <Input placeholder="Choice content" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restSubField}
                                                            name={[subName, 'imageUrl']}
                                                        >
                                                            <Input placeholder="Image URL (optional)" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restSubField}
                                                            name={[subName, 'isCorrect']}
                                                            valuePropName="checked"
                                                            initialValue={false}
                                                        >
                                                            <Checkbox />
                                                        </Form.Item>
                                                        <DeleteOutlined onClick={() => removeChoice(subName)} />
                                                    </Space>
                                                ))}
                                                <Button type="dashed" onClick={() => addChoice()} block icon={<PlusOutlined />}>
                                                    Add Choice
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>
                                </Form.Item>
                            </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Question
                        </Button>
                    </div>
                )}
            </Form.List>
        </ModalForm>
    );
};

export default CreateQuizModal;