import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './ui/AppLayout'
import Home from './views/Home'
import Login from './views/Login'
import Profile from './views/Profile'
import Tuner from './views/Tuner'
import Metronome from './views/Metronome'
import Quiz from './views/Quiz'
import QuizPortrait from './views/QuizPortrait'
import QuizPerformance from './views/QuizPerformance'
import Courses from './views/Courses'
import { Protected } from './ui/Protected'
import UserDetail from './views/UserDetail'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'login', element: <Login /> },
			{ path: 'tuner', element: <Tuner /> },
			{ path: 'metronome', element: <Metronome /> },
			{ path: 'quiz', element: <Quiz /> },
			{ path: 'quiz/portrait', element: <QuizPortrait /> },
			{ path: 'quiz/performance', element: <QuizPerformance /> },
			{ path: 'courses', element: (<Protected><Courses /></Protected>) },
			{ path: 'profile', element: (<Protected><Profile /></Protected>) },
			{ path: 'users/:id', element: (<Protected><UserDetail /></Protected>) },
		]
	}
])


