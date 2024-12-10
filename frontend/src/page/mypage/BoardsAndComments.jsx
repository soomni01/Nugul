import React, {useContext, useEffect, useState} from "react";
import { TfiWrite } from "react-icons/tfi"; // 작성한 후기 아이콘
import { LuFolder } from "react-icons/lu"; // 받은 후기 아이콘
import axios from "axios";
import {Spinner, Tabs} from "@chakra-ui/react";
import {AuthenticationContext} from "../../components/context/AuthenticationProvider.jsx";

export function BoardsAndComments({ memberId }) {
    const [boards, setBoards] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useContext(AuthenticationContext);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/boardsAndComments/${memberId}`);
                setBoards(response.data.boards);
                setComments(response.data.comments);
            } catch (error) {
                console.error("Error fetching boards and comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [memberId]);

    if (!id) {
        return <Spinner />;
    }

    return (
        <Tabs.Root defaultValue="posts">
            <Tabs.List>
                <Tabs.Trigger value="posts"> {/* 작성한 게시물 탭 */}
                    작성한 게시물
                </Tabs.Trigger>
                <Tabs.Trigger value="comments"> {/* 작성한 댓글 탭 */}
                    작성한 댓글
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="posts">
                {/* 작성한 게시물 */}
                {boards.length === 0 ? (
                    <p>작성한 게시물이 없습니다.</p>
                ) : (
                    <ul>
                    </ul>
                )}
            </Tabs.Content>

            <Tabs.Content value="comments">
                {/* 작성한 댓글 */}
                {comments.length === 0 ? (
                    <p>작성한 댓글이 없습니다.</p>
                ) : (
                    <ul>

                    </ul>
                )}
            </Tabs.Content>
        </Tabs.Root>
    );
}
