import { Box, Button, TextField, Typography, List, ListItem } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const WafFormSchema = z.object({
  N: z.string()
});

type WafFormType = z.infer<typeof WafFormSchema>;
export const Home = () => {
  const [countConf, setCountConf] = useState<{ maxCount: number; isDoingSequence: boolean; current: number }>({
    current: 0,
    isDoingSequence: false,
    maxCount: 0
  });

  const { register, handleSubmit } = useForm<WafFormType>({
    defaultValues: {
      N: "1"
    },
    resolver: zodResolver(WafFormSchema)
  });

  const doSequence = (data: WafFormType) => {
    setCountConf({
      current: 0,
      isDoingSequence: true,
      maxCount: +data.N
    });
  };

  const logs = Array(countConf.maxCount).fill(0);

  return (
    <Box sx={{ mx: "auto", width: "fit-content", textAlign: "center", py: 4 }}>
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#1976d2",
          mb: 2
        }}
      >
        STD22080
      </Typography>
      {!countConf.isDoingSequence && (
        <form onSubmit={handleSubmit(doSequence)}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <TextField
              type="number"
              placeholder="Enter N value"
              {...register("N")}
              sx={{ width: 250 }}
              variant="outlined"
              label="N Value"
            />
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#125ca8" },
                width: 150
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      )}
      {countConf.isDoingSequence && (
        <List sx={{ mt: 3, maxHeight: 300, overflowY: "auto", px: 2 }}>
          {logs.map((_, index) => (
            <ListItem
              key={uuid()}
              sx={{
                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                borderRadius: 1,
                mb: 1,
                px: 2,
                fontWeight: "bold"
              }}
            >
              {index + 1} Forbidden
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
