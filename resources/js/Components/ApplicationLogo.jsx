export default function ApplicationLogo({ className = '', onDark = false }) {
    return (
        <img
            src="/writterlogo.png"
            alt="Writter"
            className={`h-10 w-auto object-contain ${onDark ? 'brightness-0 invert' : ''} ${className}`}
            width={160}
            height={40}
        />
    );
}
