import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const assetDir = path.join(root, 'static/pages/payroll-solution-new/assets');
const laptopPath = path.join(assetDir, 'home-hero-user-clean.jpeg');
const screenPath = path.join(assetDir, 'home-payroll-screen-real-browser-capture.png');
const frameDir = path.join(tmpdir(), 'garna-home-hero-scrub-frames');
const posterPath = path.join(assetDir, 'home-hero-scroll-scrub-poster.jpg');
const sharpStillPath = path.join(assetDir, 'home-hero-scroll-sharp-still.png');
const mp4Path = path.join(assetDir, 'home-hero-scroll-scrub-lg.mp4');

const findFfmpeg = () => {
	if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;

	const command = process.platform === 'win32' ? 'where.exe' : 'which';
	const lookup = spawnSync(command, ['ffmpeg'], { encoding: 'utf8' });
	const firstMatch = lookup.stdout?.split(/\r?\n/).find(Boolean);
	if (firstMatch) return firstMatch;

	const wingetPath = process.env.LOCALAPPDATA
		? path.join(
			process.env.LOCALAPPDATA,
			'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0-full_build/bin/ffmpeg.exe',
		)
		: '';
	if (wingetPath && existsSync(wingetPath)) return wingetPath;

	return 'ffmpeg';
};

const ffmpegPath = findFfmpeg();

const width = 1920;
const height = 1080;
const frameCount = 144;
const fps = 30;
const finalScaleCorrection = 0.965;
const stillOnly = process.env.HOME_HERO_STILL_ONLY === '1';

const screenBox = {
	left: 0.47345,
	top: 0.6708,
	width: 0.0472,
	height: 0.048,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const range = (value, start, end) => clamp((value - start) / (end - start), 0, 1);
const smoothstep = (value) => value * value * (3 - 2 * value);
const lerp = (from, to, progress) => from + (to - from) * progress;
const easeOutCubic = (value) => 1 - (1 - value) ** 3;

const fitCover = (sourceWidth, sourceHeight, targetWidth, targetHeight) => {
	const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
	return {
		width: sourceWidth * scale,
		height: sourceHeight * scale,
		scale,
	};
};

const compositeScreen = async (baseBuffer, screenImage, target) => {
	const contentOffsetX = -8;
	const rect = {
		left: Math.round(target.left),
		top: Math.round(target.top),
		width: Math.max(2, Math.round(target.width)),
		height: Math.max(2, Math.round(target.height)),
	};
	const visibleLeft = clamp(rect.left, 0, width);
	const visibleTop = clamp(rect.top, 0, height);
	const visibleRight = clamp(rect.left + rect.width, 0, width);
	const visibleBottom = clamp(rect.top + rect.height, 0, height);
	const visibleWidth = visibleRight - visibleLeft;
	const visibleHeight = visibleBottom - visibleTop;

	if (visibleWidth <= 0 || visibleHeight <= 0) return baseBuffer;

	const screenMeta = await screenImage.metadata();
	const cover = fitCover(screenMeta.width, screenMeta.height, rect.width, rect.height);
	const roundedMask = Buffer.from(`
		<svg width="${visibleWidth}" height="${visibleHeight}" viewBox="0 0 ${visibleWidth} ${visibleHeight}">
			<rect width="${visibleWidth}" height="${visibleHeight}" rx="${Math.max(2, visibleWidth * 0.018)}" ry="${Math.max(2, visibleWidth * 0.018)}" fill="#fff"/>
		</svg>
	`);

	const resized = await screenImage
		.clone()
		.resize(Math.ceil(cover.width), Math.ceil(cover.height), { fit: 'fill' })
		.extract({
			left: Math.min(
				Math.max(0, Math.round(cover.width - visibleWidth)),
				Math.max(0, Math.round((cover.width - rect.width) / 2 + (visibleLeft - rect.left) + contentOffsetX)),
			),
			top: Math.max(0, Math.round((cover.height - rect.height) / 2 + (visibleTop - rect.top))),
			width: visibleWidth,
			height: visibleHeight,
		})
		.composite([{ input: roundedMask, blend: 'dest-in' }])
		.png()
		.toBuffer();

	return sharp(baseBuffer)
		.composite([{ input: resized, left: visibleLeft, top: visibleTop }])
		.jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
		.toBuffer();
};

const applyAtmosphericHaze = async (baseBuffer, screenTarget, intensity) => {
	if (intensity < 0.02) return baseBuffer;

	const focusCx = screenTarget.left + screenTarget.width / 2;
	const focusCy = screenTarget.top + screenTarget.height * 0.82;
	const edgeOpacity = Math.min(0.78, 0.16 + intensity * 0.62);
	const blurSigma = 1.8 + intensity * 3.8;
	const edgeRadius = Math.max(width, height) * 0.62;

	const edgeMask = Buffer.from(`
		<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<radialGradient id="edge" gradientUnits="userSpaceOnUse" cx="${focusCx}" cy="${focusCy}" r="${edgeRadius}">
					<stop offset="0%" stop-color="#fff" stop-opacity="0"/>
					<stop offset="34%" stop-color="#fff" stop-opacity="0"/>
					<stop offset="62%" stop-color="#fff" stop-opacity="${edgeOpacity * 0.42}"/>
					<stop offset="100%" stop-color="#fff" stop-opacity="${edgeOpacity}"/>
				</radialGradient>
				<linearGradient id="bottom" gradientUnits="userSpaceOnUse" x1="0" y1="${height * 0.6}" x2="0" y2="${height}">
					<stop offset="0%" stop-color="#fff" stop-opacity="0"/>
					<stop offset="100%" stop-color="#fff" stop-opacity="${edgeOpacity * 0.36}"/>
				</linearGradient>
			</defs>
			<rect width="${width}" height="${height}" fill="url(#edge)"/>
			<rect width="${width}" height="${height}" fill="url(#bottom)"/>
		</svg>
	`);
	const edgeMaskPng = await sharp(edgeMask).png().toBuffer();
	const edgeBlurLayer = await sharp(baseBuffer)
		.blur(blurSigma)
		.ensureAlpha()
		.composite([{ input: edgeMaskPng, blend: 'dest-in' }])
		.png()
		.toBuffer();

	return sharp(baseBuffer)
		.composite([{ input: edgeBlurLayer, left: 0, top: 0, blend: 'over' }])
		.jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
		.toBuffer();
};

const applySideBlurBehindLaptop = async (baseBuffer, screenTarget, linear) => {
	const blurIn = smoothstep(range(linear, 0.04, 0.16));
	const blurOut = 1 - smoothstep(range(linear, 0.82, 0.96));
	const opacity = Math.max(0, blurIn * blurOut);
	if (opacity < 0.02) return baseBuffer;

	const expand = smoothstep(range(linear, 0.08, 0.42));
	const retreat = 1 - smoothstep(range(linear, 0.38, 0.62));
	const spread = expand * retreat;
	const sideWidth = Math.min(width * 0.43, 40 + spread * 440);
	const blurSigma = 12 + spread * 18;
	const laptopCx = screenTarget.left + screenTarget.width / 2;
	const laptopCy = screenTarget.top + screenTarget.height * 0.82;
	const laptopRx = Math.max(screenTarget.width * 4.2, 120);
	const laptopRy = Math.max(screenTarget.height * 3.2, 72);

	const blurMask = Buffer.from(`
		<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="leftBlur" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${sideWidth}" y2="0">
					<stop offset="0%" stop-color="#fff" stop-opacity="${opacity}"/>
					<stop offset="42%" stop-color="#fff" stop-opacity="${opacity}"/>
					<stop offset="66%" stop-color="#fff" stop-opacity="${opacity * 0.78}"/>
					<stop offset="100%" stop-color="#fff" stop-opacity="0"/>
				</linearGradient>
				<linearGradient id="rightBlur" gradientUnits="userSpaceOnUse" x1="${width}" y1="0" x2="${width - sideWidth}" y2="0">
					<stop offset="0%" stop-color="#fff" stop-opacity="${opacity}"/>
					<stop offset="42%" stop-color="#fff" stop-opacity="${opacity}"/>
					<stop offset="66%" stop-color="#fff" stop-opacity="${opacity * 0.78}"/>
					<stop offset="100%" stop-color="#fff" stop-opacity="0"/>
				</linearGradient>
				<mask id="protectLaptop" maskUnits="userSpaceOnUse">
					<rect width="${width}" height="${height}" fill="#000"/>
					<rect x="0" y="0" width="${sideWidth}" height="${height}" fill="url(#leftBlur)"/>
					<rect x="${width - sideWidth}" y="0" width="${sideWidth}" height="${height}" fill="url(#rightBlur)"/>
					<ellipse cx="${laptopCx}" cy="${laptopCy}" rx="${laptopRx}" ry="${laptopRy}" fill="#000"/>
				</mask>
			</defs>
			<rect width="${width}" height="${height}" fill="#fff" mask="url(#protectLaptop)"/>
		</svg>
	`);
	const blurMaskPng = await sharp(blurMask).png().toBuffer();
	const blurLayer = await sharp(baseBuffer)
		.blur(blurSigma)
		.ensureAlpha()
		.composite([{ input: blurMaskPng, blend: 'dest-in' }])
		.png()
		.toBuffer();

	return sharp(baseBuffer)
		.composite([{ input: blurLayer, left: 0, top: 0, blend: 'over' }])
		.jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
		.toBuffer();
};

const main = async () => {
	if (!existsSync(ffmpegPath)) {
		throw new Error(`ffmpeg not found at ${ffmpegPath}`);
	}

	rmSync(frameDir, { recursive: true, force: true });
	mkdirSync(frameDir, { recursive: true });

	const laptop = sharp(laptopPath);
	const screen = sharp(screenPath);
	const laptopMeta = await laptop.metadata();
	const cover = fitCover(laptopMeta.width, laptopMeta.height, width, height);
	const screenSource = {
		left: laptopMeta.width * screenBox.left,
		top: laptopMeta.height * screenBox.top,
		width: laptopMeta.width * screenBox.width,
		height: laptopMeta.height * screenBox.height,
	};
	screenSource.centerX = screenSource.left + screenSource.width / 2;
	screenSource.centerY = screenSource.top + screenSource.height / 2;
	const fullFrameCrop = {
		width: width / cover.scale,
		height: height / cover.scale,
	};
	const startCrop = {
		width: fullFrameCrop.width,
		height: fullFrameCrop.height,
		centerX: laptopMeta.width / 2,
		centerY: laptopMeta.height / 2,
	};
	const finalScreenTop = 64;
	const finalScaleFromFullFrame =
		Math.max(width / (screenSource.width * cover.scale), height / (screenSource.height * cover.scale)) *
		((height - finalScreenTop) / height) *
		finalScaleCorrection;
	const targetScale = finalScaleFromFullFrame;
	const finalCropHeight = fullFrameCrop.height / finalScaleFromFullFrame;
	const laptopFocus = {
		x: screenSource.centerX,
		y: screenSource.top + finalCropHeight / 2 - (finalScreenTop / height) * finalCropHeight,
	};

	const framesToRender = stillOnly ? 1 : frameCount;
	for (let index = 0; index < framesToRender; index += 1) {
		const linear = framesToRender === 1 ? 0 : index / (framesToRender - 1);
		const zoomProgress = smoothstep(linear);
		const scale = lerp(1, targetScale, zoomProgress);
		const cropWidth = startCrop.width / scale;
		const cropHeight = startCrop.height / scale;
		const focusProgress = easeOutCubic(clamp(linear / 0.24, 0, 1));
		const panXProgress = smoothstep(clamp(linear / 0.28, 0, 1));
		const panYProgress = focusProgress;
		const centerX = lerp(startCrop.centerX, laptopFocus.x, panXProgress);
		const centerY = lerp(startCrop.centerY, laptopFocus.y, panYProgress);
		const cropLeft = clamp(centerX - cropWidth / 2, 0, laptopMeta.width - cropWidth);
		const cropTop = clamp(centerY - cropHeight / 2, 0, laptopMeta.height - cropHeight);
		const cropRect = {
			left: Math.round(cropLeft),
			top: Math.round(cropTop),
			width: Math.round(cropWidth),
			height: Math.round(cropHeight),
		};

		const background = await laptop
			.clone()
			.extract(cropRect)
			.resize(width, height, { fit: 'fill' })
			.jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
			.toBuffer();

		const screenTarget = {
			left: ((screenSource.left - cropRect.left) / cropRect.width) * width,
			top: ((screenSource.top - cropRect.top) / cropRect.height) * height,
			width: (screenSource.width / cropRect.width) * width,
			height: (screenSource.height / cropRect.height) * height,
		};

		const hazeIn = smoothstep(clamp(linear / 0.36, 0, 1));
		const hazeOut = 1 - smoothstep(clamp((linear - 0.8) / 0.16, 0, 1));
		const hazeIntensity = hazeIn * hazeOut;
		const hazyBackground = await applyAtmosphericHaze(background, screenTarget, hazeIntensity);
		const screenFrame = await compositeScreen(hazyBackground, screen, screenTarget);
		const frame = await applySideBlurBehindLaptop(screenFrame, screenTarget, linear);
		if (index === 0) {
			await sharp(frame).png({ compressionLevel: 9 }).toFile(sharpStillPath);
		}
		const framePath = path.join(frameDir, `frame-${String(index + 1).padStart(4, '0')}.jpg`);
		await sharp(frame).toFile(framePath);
	}

	if (stillOnly) {
		console.log(`Generated ${sharpStillPath}`);
		return;
	}

	execFileSync(ffmpegPath, [
		'-y',
		'-framerate',
		String(fps),
		'-i',
		path.join(frameDir, 'frame-%04d.jpg'),
		'-c:v',
		'libx264',
		'-g',
		'1',
		'-keyint_min',
		'1',
		'-sc_threshold',
		'0',
		'-pix_fmt',
		'yuv420p',
		'-movflags',
		'+faststart',
		'-vf',
		'scale=1920:1080:flags=lanczos,format=yuv420p',
		'-colorspace',
		'bt709',
		'-color_primaries',
		'bt709',
		'-color_trc',
		'bt709',
		'-color_range',
		'tv',
		'-crf',
		'18',
		mp4Path,
	], { stdio: 'inherit' });

	execFileSync(ffmpegPath, [
		'-y',
		'-i',
		mp4Path,
		'-frames:v',
		'1',
		'-update',
		'1',
		posterPath,
	], { stdio: 'inherit' });

	console.log(`Generated ${mp4Path}`);
	console.log(`Generated ${sharpStillPath}`);
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
