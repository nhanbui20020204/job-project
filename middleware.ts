import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const privatePaths = ['/profile', '/admin'];
const authPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('sessionToken');

  // Kiểm tra token
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET); // Xác thực token
    const userRole = decoded.role; // Lấy vai trò người dùng

    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url)); // Không có quyền admin, chuyển hướng
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // Tiếp tục nếu hợp lệ
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/profile',
    '/admin/:path*',
  ],
};
