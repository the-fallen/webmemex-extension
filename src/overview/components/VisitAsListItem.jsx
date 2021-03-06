import React, { PropTypes } from 'react'
import classNames from 'classnames'

import {localVersionAvailable, LinkToLocalVersion} from 'src/page-viewer'
import niceTime from 'src/util/nice-time'
import styles from './VisitAsListItem.css'


const VisitAsListItem = ({doc, compact}) => {
    const visitClasses = classNames({
        [styles.root]: true,
        [styles.compact]: compact,
    })
    const favIcon = (
        <img
            className={styles.favIcon}
            src={doc.page.favIcon || 'img/null-icon.png'}
        />
    )
    return (
        <a
            className={visitClasses}
            href={doc.page.url}
            // DEBUG Show document props on ctrl+meta+click
            onClick={e => { if (e.metaKey && e.ctrlKey) { console.log(doc); e.preventDefault() } }}
        >
            <div className={styles.screenshotContainer}>
                {doc.page.screenshot
                    ? <img className={styles.screenshot} src={doc.page.screenshot} />
                    : favIcon
                }
            </div>
            <div className={styles.descriptionContainer}>
                <div
                    className={styles.title}
                    title={doc.page.title}
                >
                    {doc.page.favIcon && favIcon}
                    {doc.page.title}
                </div>
                <div className={styles.url}>
                    {doc.page.url}
                </div>
                <div className={styles.time}>{niceTime(doc.visitStart)}</div>
            </div>
            <div className={styles.buttonsContainer}>
                <img src='img/trash-icon.png' alt='🗑 remove' />
                {localVersionAvailable({page: doc.page})
                    ? (
                        <LinkToLocalVersion page={doc.page}>
                            <img src='img/save-icon.png' alt='💾 saved' />
                        </LinkToLocalVersion>
                    )
                    : null
                }
            </div>
        </a>
    )
}

VisitAsListItem.propTypes = {
    doc: PropTypes.object.isRequired,
    compact: PropTypes.bool,
}

export default VisitAsListItem
