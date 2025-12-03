import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const EmailVerification = () => {
    const { user, verifyEmail, validateOTP } = useAuth();
    const [otp, setOtp] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!user?.email || user?.isEmailVerified) return null;

    const handleSendOTP = async () => {
        setLoading(true);
        try {
            await verifyEmail();
            setSent(true);
            toast.success("OTP sent to your email!");
        } catch (err) {
            toast.error("Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            await validateOTP(otp);
            toast.success("Email verified successfully!");
        } catch (err) {
            toast.error("Invalid OTP or expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-yellow-700 dark:text-yellow-500">Verify your Email</CardTitle>
                <CardDescription>
                    Your email <strong>{user.email}</strong> is unverified. Verify it to secure your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!sent ? (
                    <Button onClick={handleSendOTP} disabled={loading} variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                        {loading ? "Sending..." : "Send Verification Code"}
                    </Button>
                ) : (
                    <div className="flex gap-2 max-w-sm">
                        <Input
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <Button onClick={handleVerify} disabled={loading || otp.length < 6}>
                            {loading ? "Verifying..." : "Verify"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EmailVerification;
