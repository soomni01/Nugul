import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h1>관리자 대시보드</h1>
      <nav>
        <ul>
          <li>
            <Link to="/admin/members">회원 목록</Link>
          </li>
          <li>
            <Link to="/admin/reports">신고 목록</Link>
          </li>
          {/* 관리자 대시보드 기능에 맞는 다른 링크를 추가할 수 있습니다. */}
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
