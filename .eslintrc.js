module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
	"env": {
        "browser": true,
        "node": true
    },
	"rules": {
        // windows linebreaks when not in production environment
        "linebreak-style": ["error", process.env.NODE_ENV === 'prod' ? "unix" : "windows"],
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
		"brace-style": ["error", "allman", { "allowSingleLine": true }],
		"no-undef": "error",
		"no-console": 0
	}
};