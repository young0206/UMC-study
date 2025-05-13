import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lp } from "../types/lp";
import axios from "axios";
import Comments from "../components/comments/Comments";

const LpCardDetail = () => {
    const { LPid } = useParams();
    const [lp, setLp] = useState<Lp | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchLp = async () => {
            try {
            const res = await axios.get(`http://localhost:8000/v1/lps/${LPid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res.data.data);
            setLp(res.data.data);
        } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchLp();
    }, [LPid]);

    if (loading) return <div>불러오는 중...</div>;
    if (error || !lp) return <div>LP 정보를 불러올 수 없습니다.</div>;

    return (
        <div className="mt-10 relative duration-300 p-4">
            <div className="bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md rounded flex flex-col items-center justify-center p-4">
                <h2 className="text-lg font-bold leading-snug">{lp.title}</h2>
                <img src={lp.thumbnail} className="object-cover w-80 h-80 justify-center rounded transition-shadow" />
                <div>{lp.content}</div>
                <p className="bg-gray-300 to-transparent backdrop-blur-md rounded">{lp.tags?.join(', ')}</p>
                <p className="text-sm text-gray-300 leading-relaxed mt-2">
                    ♡ {lp.likes?.length ?? 0}개
                </p>
            </div>
            <div><Comments /></div>
            

        </div>
    );
};

export default LpCardDetail;
