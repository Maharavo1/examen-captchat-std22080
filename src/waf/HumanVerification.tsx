import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, CircularProgress, Box } from "@mui/material";
import { loadAwsWafScript } from "../waf";
import { Env } from "../conf/env";

export const HumanVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectURL = `/?current=${searchParams.get("current")}&max=${searchParams.get("max")}`;

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const captchaOpen = useRef(false);

  const displayCaptcha = async (): Promise<string | undefined> => {
    const { awsWafCaptcha } = await loadAwsWafScript();

    if (captchaOpen.current) return;

    captchaOpen.current = true;

    return new Promise((resolve) => {
      captchaRef.current?.firstChild?.remove();
      awsWafCaptcha.renderCaptcha(captchaRef.current!, {
        apiKey: Env.wafApiKey,
        onSuccess: (token: string) => {
          captchaOpen.current = false;
          navigate(redirectURL);
          resolve(token);
        },
      });
    });
  };

  useEffect(() => {
    displayCaptcha();
  }, []);

  return (
    <Dialog open fullWidth maxWidth="sm" ref={captchaContainerRef}>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} ref={captchaRef}>
          <CircularProgress />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
