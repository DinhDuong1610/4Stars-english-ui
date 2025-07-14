import { useEffect, useState } from 'react';
import { Card, Empty, Button, Collapse, Space, Tag, List, Radio, Image, message, Skeleton, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { IQuiz, IQuestion } from 'types/quiz.type';
import { deleteQuizAPI, fetchQuizzesAPI, generateQuizAPI } from 'services/quiz.service';

const { Panel } = Collapse;

interface QuizDetailViewProps {
    categoryId: number | null;
    type: "VOCABULARY" | "GRAMMAR";
}

const QuizDetailView = ({ categoryId, type }: QuizDetailViewProps) => {
    const [quiz, setQuiz] = useState<IQuiz | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [categoryId]);

    const fetchQuiz = async () => {
        if (!categoryId) {
            setQuiz(null);
            return;
        };
        setIsLoading(true);
        try {
            const res = await fetchQuizzesAPI(`categoryId=${categoryId}`);
            if (res && res.data) {
                setQuiz(res.data.result[0]);
            } else {
                setQuiz(null);
            }
        } catch (error) {
            message.error("Failed to fetch quiz details.");
            setQuiz(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateQuizVocabulary = async () => {
        if (!categoryId) return;

        setIsGenerating(true);
        try {
            const res = await generateQuizAPI(categoryId);
            if (res && res.data) {
                message.success("Quiz generated successfully!");
                await fetchQuiz();
            } else {
                message.error(res.message || "Failed to generate quiz.");
            }
        } catch (error) {
            message.error("An error occurred during quiz generation.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteQuiz = async () => {
        if (!quiz) return;

        try {
            const res = await deleteQuizAPI(quiz.id);
            if (res) {
                message.success("Quiz deleted successfully!");
                setQuiz(null);
            } else {
                message.error(res.data?.message || "Failed to delete quiz.");
            }
        } catch (error) {
            message.error("An error occurred while deleting the quiz.");
        }
    };

    if (isLoading) {
        return (
            <Card title={<Skeleton.Input active style={{ width: '200px' }} />} extra={<Skeleton.Button active />}>
                <Skeleton.name />
                <br />
                <Skeleton.Input active block style={{ marginBottom: '16px' }} />
                <Skeleton.Input active block style={{ marginBottom: '16px' }} />
                <Skeleton.Input active block />
            </Card>
        );
    }

    if (!quiz) {
        return (
            <Card>
                <Empty description="No quiz found for this category.">
                    <Button type="primary" icon={<PlusOutlined />}
                        onClick={() => {
                            if (type === "VOCABULARY") {
                                handleGenerateQuizVocabulary();
                            } else {
                                message.error("Only vocabulary quizzes can be created.");
                            }
                        }}
                        loading={isGenerating}>
                        Create New Quiz
                    </Button>
                </Empty>
            </Card>
        );
    }

    const QuestionDisplay = ({ question }: { question: IQuestion }) => (
        <div>
            <Tag
                color={question.questionType === 'FILL_IN_BLANK' ? 'yellow' :
                    question.questionType === 'LISTENING_COMPREHENSION' ? 'purple' :
                        question.questionType === 'MULTIPLE_CHOICE_IMAGE' ? 'pink' : 'orange'
                }
            >
                {question.questionType}
            </Tag>
            {question.audioUrl && <audio controls src={question.audioUrl} style={{ height: '30px', marginLeft: '10px' }} />}
            {question.imageUrl && <Image src={question.imageUrl} width={100} />}

            <List
                size="small"
                // header={<div>Choices</div>}
                bordered
                dataSource={question.choices}
                renderItem={(choice) => (
                    <List.Item style={{ background: choice.isCorrect ? '#CCEFB2' : 'inherit' }}>
                        <Radio checked={choice.isCorrect}>{choice.content || <Image src={choice.imageUrl ?? ''} width={80} />}</Radio>
                    </List.Item>
                )}
            />
        </div>
    );

    return (
        <Card
            title={quiz.title}
            extra={
                <Space>
                    <Button icon={<EditOutlined />}>Edit Quiz Info</Button>
                    <Button type="primary" icon={<PlusOutlined />}>Add Question</Button>
                    <Popconfirm
                        title="Delete this quiz"
                        description="Are you sure? This will delete the quiz and all its questions."
                        onConfirm={handleDeleteQuiz}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        okText="Yes, Delete"
                        okButtonProps={{ danger: true }}
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />}>Delete Quiz</Button>
                    </Popconfirm>
                </Space>
            }
        >
            <p>{quiz.description}</p>
            <Collapse>
                {quiz.questions.map((q, index) => (
                    <Panel
                        header={`Question ${index + 1}: ${q.prompt}`}
                        key={q.id}
                        extra={
                            <Space onClick={e => e.stopPropagation()}>
                                <Button size="small" icon={<EditOutlined />} />
                                <Button size="small" danger icon={<DeleteOutlined />} />
                            </Space>
                        }
                    >
                        <QuestionDisplay question={q} />
                    </Panel>
                ))}
            </Collapse>
        </Card>
    );
};

export default QuizDetailView;