import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import CreateStudentPage from './pages/CreateStudentPage';
import EditStudentPage from './pages/EditStudentPage';

export const StudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentListPage />} />
      <Route path="/:cui" element={<StudentDetailPage />} />
      <Route path="/new" element={<CreateStudentPage />} />
      <Route path="/:cui/edit" element={<EditStudentPage />} />
    </Routes>
  );
};

export default StudentRoutes;
