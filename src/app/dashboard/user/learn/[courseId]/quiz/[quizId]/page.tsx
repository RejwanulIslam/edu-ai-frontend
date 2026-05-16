"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { coursesApi, quizApi } from "@/lib/api";
import { Course, Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function QuizTakingPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: courseRes, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesApi.getById(courseId).then((r) => r.data),
  });

  const { data: quizzesRes, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: () => quizApi.getByCourse(courseId).then((r) => r.data),
  });

  const submitMutation = useMutation({
    mutationFn: (answersArray: number[]) => quizApi.submitAttempt(quizId, answersArray),
    onSuccess: (res) => {
      setResult(res.data.data);
      setIsSubmitted(true);
      toast.success("Quiz submitted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    }
  });

  if (isLoadingCourse || isLoadingQuiz) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const course: Course = courseRes?.data;
  const quizzes: Quiz[] = quizzesRes?.data || [];
  const quiz = quizzes.find((q) => q.id === quizId);

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
        <Button onClick={() => router.push(`/dashboard/user/learn/${courseId}`)}>Back to Course</Button>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < totalQuestions) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    // Format answers array
    const answersArray = Array.from({ length: totalQuestions }).map((_, i) => answers[i]);
    submitMutation.mutate(answersArray);
  };

  if (isSubmitted && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/dashboard/user/learn/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
          </Link>
        </Button>

        <Card className="border-border overflow-hidden">
          <div className="bg-muted/40 p-8 text-center border-b border-border">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-background shadow-sm border border-border">
              {result.score >= 70 ? (
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              ) : (
                <AlertCircle className="h-10 w-10 text-yellow-500" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              You scored {result.score.toFixed(0)}%
            </h2>
            <p className="text-muted-foreground">
              You got {result.correct} out of {result.total} questions correct.
            </p>
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6">Detailed Results</h3>
            <div className="space-y-6">
              {result.results.map((r: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg border border-border bg-muted/20">
                  <p className="font-medium mb-4">{idx + 1}. {r.question}</p>

                  <div className="space-y-2 mb-4">
                    <div className={cn(
                      "p-3 rounded border",
                      r.isCorrect
                        ? "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300"
                        : "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300"
                    )}>
                      <span className="font-semibold block text-xs uppercase mb-1">Your Answer</span>
                      {r.yourAnswer}
                    </div>

                    {!r.isCorrect && (
                      <div className="p-3 rounded border bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300">
                        <span className="font-semibold block text-xs uppercase mb-1">Correct Answer</span>
                        {r.correctAnswer}
                      </div>
                    )}
                  </div>

                  {r.explanation && (
                    <div className="text-sm text-muted-foreground bg-background p-3 rounded border border-border">
                      <span className="font-semibold block mb-1">Explanation:</span>
                      {r.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/40 p-6 flex justify-between">
            <Button variant="outline" onClick={() => {
              setIsSubmitted(false);
              setAnswers({});
              setCurrentQuestionIndex(0);
              setResult(null);
            }}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retake Quiz
            </Button>
            <Button asChild>
              <Link href={`/dashboard/user/learn/${courseId}`}>
                Continue Course
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/user/learn/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground text-sm">{course?.title}</p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-2">
            <CardDescription>Question {currentQuestionIndex + 1} of {totalQuestions}</CardDescription>
            {quiz.timeLimit && (
              <Badge variant="outline">{quiz.timeLimit} min limit</Badge>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="pt-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-medium mb-6">{currentQuestion?.text}</h2>

              <RadioGroup
                value={answers[currentQuestionIndex]?.toString()}
                onValueChange={(val: any) => handleAnswerSelect(parseInt(val))}
                className="space-y-3"
              >
                {currentQuestion?.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={idx.toString()}
                      id={`option-${idx}`}
                      className="peer"
                    />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="flex-1 p-4 rounded-lg border border-border cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-border pt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || Object.keys(answers).length < totalQuestions}
            >
              {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-2 justify-center mt-8">
        {Array.from({ length: totalQuestions }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestionIndex(idx)}
            className={cn(
              "w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center border transition-colors",
              currentQuestionIndex === idx
                ? "border-primary bg-primary text-primary-foreground"
                : answers[idx] !== undefined
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border hover:bg-muted text-muted-foreground"
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
