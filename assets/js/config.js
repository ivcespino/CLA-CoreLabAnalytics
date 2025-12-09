tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": {
                    DEFAULT: "#1A237E",
                    light: "#E8EAF6"
                },
                "accent": "#00B8D4",
                
                "bg-light": "#F1F5F9",      
                "text-muted-light": "#475569",
                "border-light": "#CBD5E1", 

                "bg-dark": "#101622",
                "text-light": "#0F172A",    
                "text-dark": "#F8F9FA",
                "text-muted-dark": "#94A3B8",
                "card-light": "#ffffff",
                "card-dark": "#1A2035",
                "border-dark": "#2c3e50",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
};