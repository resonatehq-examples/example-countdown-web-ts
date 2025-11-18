# Countdown Timer - Browser Example

A *Countdown* powered by the Resonate Typescript SDK and running in the browser. The countdown sends periodic browser notifications at configurable intervals.

---

# Running the Example

## 1. Prerequisites

Install the Resonate Server & CLI with [Homebrew](https://docs.resonatehq.io/operate/run-server#install-with-homebrew) or download the latest release from [Github](https://github.com/resonatehq/resonate/releases).

```
brew install resonatehq/tap/resonate
```

## 2. Start Resonate Server

Start the Resonate Server. By default, the Resonate Server will listen at `http://localhost:8001`.

```
resonate dev --api-http-cors-allow-origin http://localhost:5173
```

### 3. Setup the Countdown

Clone the repository

```
git clone https://github.com/resonatehq-examples/example-countdown-web-ts
cd example-countdown-web-ts
```

Install dependencies

```
npm install
```

### 4. Start the Countdown

Start the web application

```
npm run dev
```

Visit `http://localhost:5173`
