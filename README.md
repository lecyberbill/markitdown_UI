# MarkItDown Web

> **Fork de [microsoft/markitdown](https://github.com/microsoft/markitdown)**  
> Interface web par-dessus l'outil de conversion de fichiers en Markdown.

Convertissez vos fichiers (PDF, Word, Excel, PowerPoint, images, audio, HTML, etc.) en Markdown directement depuis votre navigateur.

## Démarrage rapide

```bash
# Installer les dépendances
pip install -r requirements.txt

# Format supportés (optionnel : installez ce dont vous avez besoin)
# Pour tous les formats :
pip install -e "packages/markitdown[all]"
# Ou seulement quelques formats :
pip install -e "packages/markitdown[pdf,docx,pptx]"

# Lancer le serveur
uvicorn app.server:app --reload --host 127.0.0.1 --port 8000
```

Ouvrez http://127.0.0.1:8000

## Structure

```
markitdown/
├── app/               # Web application
│   ├── server.py      # Backend FastAPI
│   └── static/        # Frontend vanilla
│       ├── index.html
│       ├── style.css
│       └── app.js
├── packages/
│   └── markitdown/    # Moteur de conversion (coeur)
├── requirements.txt   # Dépendances web
└── README.md
```

## Formats supportés

| Format | Extension |
|---|---|
| PDF | `.pdf` |
| Word | `.docx` |
| PowerPoint | `.pptx` |
| Excel | `.xlsx`, `.xls` |
| Images | `.jpg`, `.png`, `.gif`, `.webp`, `.bmp` |
| Audio | `.mp3`, `.wav`, `.m4a` |
| HTML | `.html`, `.htm` |
| Texte | `.csv`, `.json`, `.xml`, `.txt` |
| EPUB | `.epub` |
| Outlook | `.msg` |
| ZIP | `.zip` |
| Jupyter | `.ipynb` |
| YouTube | URLs |
| RSS / Wikipedia / Bing | URLs |

et plus via plugins.

## API

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("fichier.pdf")
print(result.markdown)
```

## Licence

MIT
