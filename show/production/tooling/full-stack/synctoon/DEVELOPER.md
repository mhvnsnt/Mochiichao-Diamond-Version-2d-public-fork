# Developer Guide 🛠️

Welcome to the synctoon developer documentation! This guide provides comprehensive technical details for developers who want to understand, contribute to, or extend the synctoon codebase.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Development Setup](#development-setup)
- [Code Structure](#code-structure)
- [API Integration](#api-integration)
- [Asset Management](#asset-management)
- [Frame Generation Pipeline](#frame-generation-pipeline)
- [Testing](#testing)
- [Contributing Guidelines](#contributing-guidelines)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

Synctoon follows a modular pipeline architecture that processes text and audio inputs through several stages to produce animated video output.

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Input     │    │ AI Analysis  │    │   Frame     │    │    Video     │
│ Text/Audio  │───▶│   & Sync     │───▶│ Generation  │───▶│  Compilation │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
   Script.txt         Animation Cues      PNG Frames         Final.mp4
   Audio.mp3          Timing Data         Asset Composites
```

## 🔧 Core Components

### 1. Brain Requests (`core/brain_requests/`)

**Purpose**: Handles AI-powered text analysis and audio processing

#### Key Files:
- `prompts.py`: Contains AI prompts for text analysis
- `text_aligner.py`: Aligns processed text with timing data
- `speach_aligner.py`: Handles speech-to-text alignment
- `utils.py`: Utility functions for data processing
- `validater.py`: Validates AI responses and data integrity

#### Technical Details:
```python
# Example AI prompt structure
ANIMATION_PROMPT = {
    "system": "Analyze text for animation cues",
    "user_template": "Extract head movements, emotions, and dialogue from: {text}",
    "response_format": "JSON with timestamps and animation data"
}
```

### 2. Image Manager (`core/image_manager/`)

**Purpose**: Manages character assets and compositing

#### Key Files:
- `CharacterManager.py`: Main class for character asset handling

#### Technical Implementation:
```python
class CharacterManager:
    def __init__(self, character_path, metadata_path):
        self.assets = self.load_character_assets()
        self.metadata = self.load_metadata()
    
    def composite_frame(self, frame_data):
        # Layer assets: background → body → head → eyes → mouth
        pass
    
    def apply_emotion(self, emotion_type, intensity):
        # Dynamically select appropriate asset variations
        pass
```

### 3. Frame Generator (`core/frame_generator.py`)

**Purpose**: Creates individual animation frames

#### Process Flow:
1. **Background Loading**: Selects appropriate background based on scene context
2. **Character Positioning**: Places characters according to metadata coordinates
3. **Asset Layering**: Composites body parts in correct z-order
4. **Effect Application**: Applies zoom, transitions, and visual effects
5. **Frame Export**: Saves as PNG with sequential numbering

```python
def generate_frame(frame_index, animation_data):
    # 1. Create base canvas
    canvas = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0))
    
    # 2. Add background
    background = load_background(animation_data['scene'])
    canvas.paste(background, (0, 0))
    
    # 3. Composite characters
    for character in animation_data['characters']:
        character_composite = create_character_composite(character)
        canvas.paste(character_composite, character['position'])
    
    # 4. Apply effects
    if animation_data.get('zoom'):
        canvas = apply_zoom(canvas, animation_data['zoom'])
    
    return canvas
```

## 📊 Data Flow

### Input Processing
```
Text Script ──┐
              ├─► AI Analysis ──► Animation Cues (JSON)
Audio File ───┘                         │
                                        ▼
Gentle Service ──► Transcription ──► Timing Alignment
                                        │
                                        ▼
                               Frame Instructions
```

### Animation Data Structure
```json
{
  "frames": [
    {
      "timestamp": 0.0,
      "duration": 0.033,
      "characters": [
        {
          "character_id": "character_1",
          "position": [640, 360],
          "head_direction": "center",
          "eye_emotion": "happy",
          "mouth_shape": "A",
          "body_pose": "standing"
        }
      ],
      "background": "living-room-1",
      "camera": {
        "zoom": 1.0,
        "focus": [640, 360]
      }
    }
  ]
}
```

## 🚀 Development Setup

### Prerequisites
- Python 3.8+
- Docker & Docker Compose
- FFmpeg (for video processing)
- Google AI Studio API Key

### Local Development
```bash
# 1. Clone and setup
git clone https://github.com/Automate-Animation/synctoon.git
cd synctoon

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies

# 4. Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# 5. Start services
cd Docker
docker-compose up -d

# 6. Run tests
pytest tests/
```

### Development Dependencies
```txt
# requirements-dev.txt
pytest>=7.0.0
black>=22.0.0
flake8>=4.0.0
mypy>=0.950
pre-commit>=2.15.0
```

## 📁 Code Structure

```
synctoon/
├── core/
│   ├── __init__.py
│   ├── core.py                    # Main orchestrator
│   ├── create_animation.py        # CLI entry point
│   ├── frame_generator.py         # Frame composition logic
│   ├── frame_to_video.py         # Video compilation
│   ├── check_models.py           # Model validation
│   ├── test.py                   # Integration tests
│   │
│   ├── brain_requests/           # AI & Audio Processing
│   │   ├── __init__.py
│   │   ├── prompts.py           # AI prompt templates
│   │   ├── text_aligner.py      # Text-audio alignment
│   │   ├── speach_aligner.py    # Speech processing
│   │   ├── utils.py             # Utility functions
│   │   └── validater.py         # Data validation
│   │
│   ├── image_manager/           # Asset Management
│   │   ├── __init__.py
│   │   └── CharacterManager.py  # Character asset handler
│   │
│   ├── images/                  # Asset Storage
│   │   ├── characters/          # Character assets
│   │   │   └── character_1/
│   │   │       ├── body/        # Body variations
│   │   │       ├── head/        # Head positions
│   │   │       ├── eyes/        # Eye emotions
│   │   │       ├── mouth/       # Mouth shapes
│   │   │       └── background/  # Scene backgrounds
│   │   └── metadata/
│   │       └── metadata.json    # Asset positioning data
│   │
│   └── utils/                   # Utility Scripts
│       ├── add_phonemes.py      # Phoneme processing
│       ├── constants.py         # Global constants
│       ├── frame_info_generator.py
│       ├── mouth_image.json     # Mouth shape mappings
│       └── update_character_asset_name.py
│
├── example/story/               # Sample content
├── Docker/                      # Service containers
├── tests/                       # Test suite
└── docs/                        # Documentation
```

## 🔌 API Integration

### Google Generative AI
```python
# core/brain_requests/utils.py
import google.generativeai as genai

class AIAnalyzer:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def analyze_text(self, text, prompt_template):
        """Analyze text for animation cues"""
        prompt = prompt_template.format(text=text)
        response = self.model.generate_content(prompt)
        return self.parse_response(response.text)
```

### Gentle Transcription Service
```python
# core/brain_requests/speach_aligner.py
import requests

class GentleClient:
    def __init__(self, base_url="http://localhost:49153"):
        self.base_url = base_url
    
    def transcribe(self, audio_file, transcript):
        """Align audio with transcript"""
        files = {
            'audio': open(audio_file, 'rb'),
            'transcript': transcript
        }
        response = requests.post(f"{self.base_url}/transcriptions", files=files)
        return response.json()
```

## 🎨 Asset Management

### Character Asset Structure
```
character_1/
├── body/
│   ├── standing/
│   │   ├── body1.png
│   │   └── body2.png
│   └── sitting/
│       └── body_sitting.png
├── head/
│   ├── center/
│   ├── left/
│   └── right/
├── eyes/
│   ├── happy/
│   │   ├── eyes_happy.png
│   │   └── eyes_happy_blink/
│   ├── sad/
│   └── neutral/
└── mouth/
    ├── A/          # Phoneme shapes
    ├── E/
    ├── I/
    └── closed/
```

### Metadata Configuration
```json
{
  "character_1": {
    "body": {
      "position": [640, 800],
      "size": [400, 600],
      "anchor": "bottom-center"
    },
    "head": {
      "position": [640, 300],
      "size": [200, 250],
      "anchor": "center"
    },
    "eyes": {
      "position": [640, 250],
      "size": [150, 50],
      "anchor": "center"
    },
    "mouth": {
      "position": [640, 320],
      "size": [80, 40],
      "anchor": "center"
    }
  }
}
```

## 🎬 Frame Generation Pipeline

### 1. Scene Analysis
```python
def analyze_scene(text_segment, timestamp):
    """Extract scene information from text"""
    scene_data = {
        'location': extract_location(text_segment),
        'characters': extract_characters(text_segment),
        'emotions': extract_emotions(text_segment),
        'actions': extract_actions(text_segment)
    }
    return scene_data
```

### 2. Asset Selection
```python
def select_assets(character_data, emotion, phoneme):
    """Select appropriate assets for current frame"""
    assets = {
        'body': f"body/{character_data['pose']}/body1.png",
        'head': f"head/{character_data['head_direction']}/head.png",
        'eyes': f"eyes/{emotion}/eyes_{emotion}.png",
        'mouth': f"mouth/{phoneme}/mouth_{phoneme}.png"
    }
    return assets
```

### 3. Composition
```python
def composite_frame(background, character_assets, metadata):
    """Composite all assets into final frame"""
    frame = load_background(background)
    
    # Layer order: background → body → head → eyes → mouth
    for asset_type in ['body', 'head', 'eyes', 'mouth']:
        asset = load_asset(character_assets[asset_type])
        position = metadata[asset_type]['position']
        frame = overlay_asset(frame, asset, position)
    
    return frame
```

## 🧪 Testing

### Test Structure
```
tests/
├── unit/
│   ├── test_character_manager.py
│   ├── test_frame_generator.py
│   └── test_ai_analyzer.py
├── integration/
│   ├── test_full_pipeline.py
│   └── test_asset_loading.py
└── fixtures/
    ├── sample_audio.mp3
    ├── sample_script.txt
    └── test_assets/
```

### Running Tests
```bash
# Run all tests
pytest

# Run specific test categories
pytest tests/unit/
pytest tests/integration/

# Run with coverage
pytest --cov=core tests/

# Run performance tests
pytest tests/performance/ --benchmark-only
```

### Example Test
```python
# tests/unit/test_character_manager.py
import pytest
from core.image_manager.CharacterManager import CharacterManager

class TestCharacterManager:
    def setup_method(self):
        self.manager = CharacterManager("tests/fixtures/test_assets")
    
    def test_load_character_assets(self):
        assets = self.manager.load_character_assets()
        assert 'character_1' in assets
        assert 'body' in assets['character_1']
    
    def test_composite_frame(self):
        frame_data = {
            'character_id': 'character_1',
            'emotion': 'happy',
            'phoneme': 'A'
        }
        frame = self.manager.composite_frame(frame_data)
        assert frame is not None
        assert frame.size == (1920, 1080)
```

## 🤝 Contributing Guidelines

### Code Style
```bash
# Format code
black core/ tests/

# Lint code
flake8 core/ tests/

# Type checking
mypy core/
```

### Git Workflow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add new animation feature"

# 3. Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Pull Request Checklist
- [ ] Tests pass (`pytest`)
- [ ] Code is formatted (`black`)
- [ ] Code is linted (`flake8`)
- [ ] Type checking passes (`mypy`)
- [ ] Documentation is updated
- [ ] Change log is updated

## 🐛 Troubleshooting

### Common Issues

#### 1. Gentle Service Not Running
```bash
# Check service status
docker-compose ps

# Restart service
docker-compose restart gentle

# Check logs
docker-compose logs gentle
```

#### 2. Asset Loading Errors
```python
# Debug asset paths
import os
asset_path = "core/images/characters/character_1/body/body1.png"
print(f"Asset exists: {os.path.exists(asset_path)}")
```

#### 3. Memory Issues with Large Animations
```python
# Optimize memory usage
import gc

def generate_frames_batched(frame_data, batch_size=50):
    for i in range(0, len(frame_data), batch_size):
        batch = frame_data[i:i + batch_size]
        process_batch(batch)
        gc.collect()  # Force garbage collection
```

#### 4. Audio Sync Issues
```python
# Verify audio alignment
def check_audio_alignment(gentle_output):
    for word in gentle_output['words']:
        if word['case'] != 'success':
            print(f"Alignment issue: {word}")
```

### Performance Optimization

#### 1. Asset Caching
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def load_asset_cached(asset_path):
    """Cache frequently used assets"""
    return Image.open(asset_path)
```

#### 2. Parallel Frame Generation
```python
from multiprocessing import Pool

def generate_frames_parallel(frame_data):
    with Pool(processes=4) as pool:
        frames = pool.map(generate_single_frame, frame_data)
    return frames
```

#### 3. Memory Profiling
```bash
# Install memory profiler
pip install memory-profiler

# Profile memory usage
python -m memory_profiler core/frame_generator.py
```

## 📚 Additional Resources

- [Google Generative AI Documentation](https://developers.generativeai.google/)
- [Gentle Forced Alignment](https://github.com/lowerquality/gentle)
- [PIL/Pillow Documentation](https://pillow.readthedocs.io/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with basic animation pipeline
- Character asset management system
- AI-powered text analysis
- Audio synchronization

### Planned v1.1.0
- Web interface
- Enhanced character library
- Background generation system
- Performance improvements

---

**Happy coding! 🚀**

For questions or support, please open an issue on GitHub or contact the maintainers.
