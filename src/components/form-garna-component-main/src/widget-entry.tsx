import React from 'react';
import ReactDOM from 'react-dom/client';
import { WidgetWrapper } from './widget-wrapper';
import { IModalProps } from './components/modal/modal';
import { persistUtmFromUrl } from './utils/collectUtm';
import './index.css';

// Persist UTM from URL to cookies and localStorage as soon as the user lands on the site
persistUtmFromUrl();

interface WidgetConfig extends Partial<IModalProps> {
	containerId?: string;
	/** When true, render form inline (no overlay, no close). Widget stays open and mounts in container. */
	embedInline?: boolean;
}

type ReactRoot = ReturnType<typeof ReactDOM.createRoot>;

class GarnaWidgetClass {
	private root: ReactRoot | null = null;
	private container: HTMLElement | null = null;
	private isOpen: boolean = false;
	private config: WidgetConfig = {};
	private isInitialized: boolean = false;
	private embedInline: boolean = false;

	/**
	 * Initialize the widget with configuration
	 */
	init(config: WidgetConfig = {}): void {
		if (this.isInitialized) {
			return;
		}

		this.config = config;
		this.embedInline = config.embedInline === true;
		this.isInitialized = true;

		// When embedInline, start open and stay open
		if (this.embedInline) {
			this.isOpen = true;
		}

		// Create or get container
		const containerId = config.containerId || 'garna-widget-root';
		let container = document.getElementById(containerId);

		if (!container) {
			container = document.createElement('div');
			container.id = containerId;
			document.body.appendChild(container);
		}

		this.container = container;

		// Create React root
		this.root = ReactDOM.createRoot(this.container);
		this.render();
	}

	/**
	 * Open the modal
	 */
	open(): void {
		if (!this.isInitialized) {
			return;
		}

		this.isOpen = true;
		this.render();
	}

	/**
	 * Close the modal
	 */
	close(): void {
		if (!this.isInitialized) {
			return;
		}

		this.isOpen = false;
		this.render();
	}

	/**
	 * Destroy the widget and clean up
	 */
	destroy(): void {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}

		if (this.container && this.container.parentNode) {
			this.container.parentNode.removeChild(this.container);
			this.container = null;
		}

		this.isOpen = false;
		this.config = {};
		this.isInitialized = false;
	}

	/**
	 * Update widget configuration
	 */
	updateConfig(config: Partial<WidgetConfig>): void {
		if (!this.isInitialized) {
			return;
		}

		this.config = { ...this.config, ...config };
		this.render();
	}

	/**
	 * Get current widget state
	 */
	getState(): { isOpen: boolean; isInitialized: boolean } {
		return {
			isOpen: this.isOpen,
			isInitialized: this.isInitialized,
		};
	}

	/**
	 * Internal render method
	 */
	private render(): void {
		if (!this.root) {
			return;
		}

		const configWithEmbedded = this.embedInline
			? { ...this.config, embedded: true as const }
			: this.config;
		const isOpen = this.embedInline ? true : this.isOpen;

		this.root.render(
			<React.StrictMode>
				<WidgetWrapper
					isOpen={isOpen}
					onClose={() => this.close()}
					config={configWithEmbedded}
				/>
			</React.StrictMode>
		);
	}
}

// Create and expose global instance immediately
const GarnaWidgetInstance = new GarnaWidgetClass();

// Expose to window
declare global {
	interface Window {
		GarnaWidget: GarnaWidgetClass;
	}
}

// Assign to window directly (not waiting for anything)
window.GarnaWidget = GarnaWidgetInstance;

// Export for module usage
export default GarnaWidgetInstance;
