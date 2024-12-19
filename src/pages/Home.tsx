import { Box, Button, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { getAxiosInstance } from "../conf/axios";
import { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const FormSchema = z.object({
  N: z.string(),
});

type FormType = z.infer<typeof FormSchema>;
const API_URL = "https://api.prod.jcloudify.com/whoami";

export const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<{
    timer: NodeJS.Timeout | null;
    limit: number;
    inProgress: boolean;
    currentIndex: number;
  }>({
    currentIndex: +(searchParams.get("current") ?? 0),
    inProgress: searchParams.get("current") !== null,
    limit: +(searchParams.get("max") ?? 0),
    timer: null,
  });

  const { register, handleSubmit } = useForm<FormType>({
    defaultValues: {
      N: "1",
    },
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (!state.inProgress) return;

    const interval = setInterval(() => {
      verifyIdentity();
    }, 1000);

    setState((prev) => ({
      ...prev,
      timer: interval,
    }));

    return () => {
      clearInterval(interval);
    };
  }, [state.inProgress]);

  const verifyIdentity = async () => {
    try {
      await getAxiosInstance().get(API_URL);
      throw new Error("Expected error");
    } catch (error) {
      if ((error as AxiosError).status === 405) {
        navigate(`/verification?current=${state.currentIndex}&max=${state.limit}`);
        return;
      }
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
    }
  };

  useEffect(() => {
    if (state.currentIndex >= state.limit) {
      if (state.timer) clearInterval(state.timer);
      setState({
        currentIndex: 0,
        timer: null,
        limit: 1,
        inProgress: false,
      });
    }
  }, [state.currentIndex, state.limit]);

  const startSequence = (data: FormType) => {
    setState({
      currentIndex: 0,
      inProgress: true,
      limit: +data.N,
      timer: null,
    });
  };

  const logItems = Array(state.currentIndex).fill(0);

  return (
    <Box sx={{ mx: "auto", width: "fit-content" }}>
      {state.inProgress && (
        <Typography
          sx={{ textAlign: "center", fontSize: "1rem", opacity: 0.8, fontWeight: "bold", mt: 5, mb: 2 }}
        >
          Total Steps: {state.limit}
          <br />
          Current Step: {state.currentIndex}
        </Typography>
      )}
      <Typography
        sx={{ textAlign: "center", fontSize: "1rem", opacity: 0.8, fontWeight: "bold", mt: 5, mb: 2 }}
      >
        Application Tracker
      </Typography>
      {!state.inProgress && (
        <form onSubmit={handleSubmit(startSequence)}>
          <TextField
            type="number"
            placeholder="Enter a value"
            {...register("N")}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit">
            Start
          </Button>
        </form>
      )}
      {logItems.map((_, idx) => (
        <li key={uuid()}>{idx + 1} Action Not Allowed</li>
      ))}
    </Box>
  );
};