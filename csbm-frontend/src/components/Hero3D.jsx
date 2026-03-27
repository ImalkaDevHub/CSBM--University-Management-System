import Spline from '@splinetool/react-spline';

export default function Hero3D() {
    return (
        <div className="w-full h-full">
            {/* 
        NOTE: Since I don't have a custom Spline URL created by the user, 
        I am using a public "Education/Abstract" scene URL as a placeholder.
        In a real scenario, the user would provide their own Spline export URL.
      */}
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>
    );
}
