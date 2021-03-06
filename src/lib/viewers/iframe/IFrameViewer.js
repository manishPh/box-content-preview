import BaseViewer from '../BaseViewer';
import { ICON_FILE_BOX_NOTE, ICON_FILE_DICOM } from '../../icons/icons';

const LOADING_ICON_MAP = {
    boxdicom: ICON_FILE_DICOM,
    boxnote: ICON_FILE_BOX_NOTE
};

class IFrameViewer extends BaseViewer {
    /**
     * @inheritdoc
     */
    setup() {
        const fileExt = this.options.file.extension;
        this.fileLoadingIcon = LOADING_ICON_MAP[fileExt];

        // Call super() to set up common layout
        super.setup();

        this.iframeEl = this.containerEl.appendChild(document.createElement('iframe'));
        this.iframeEl.setAttribute('width', '100%');
        this.iframeEl.setAttribute('height', '100%');
        this.iframeEl.setAttribute('frameborder', 0);
        // Timeout for loading the preview
        this.loadTimeout = 120000;
    }

    /**
     * Loads a boxnote or boxdicom file
     *
     * @return {void}
     */
    load() {
        this.setup();

        let src = '';
        const { file, sharedLink = '', appHost } = this.options;
        const { extension } = file;

        if (extension === 'boxnote') {
            src = `${appHost}/notes/${file.id}?isReadonly=1&is_preview=1`;

            // Append shared name if needed, Box Notes uses ?s=SHARED_NAME
            const sharedNameIndex = sharedLink.indexOf('/s/');
            if (sharedNameIndex !== -1) {
                const sharedName = sharedLink.substr(sharedNameIndex + 3); // shared name starts after /s/
                src = `${src}&s=${sharedName}`;
            }
        } else if (extension === 'boxdicom') {
            src = `${appHost}/dicom_viewer/${file.id}`;
        }

        this.iframeEl.src = src;
        this.loaded = true;
        this.emit('load');
        super.load();
    }
}

export default IFrameViewer;
