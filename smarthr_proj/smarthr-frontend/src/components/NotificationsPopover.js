import React, { useEffect, useState, useRef } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

export default function NotificationsPopover({ employeeId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const listRef = useRef(null); // Prevent scrollTop error

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Fetch unread count
  useEffect(() => {
    if (!employeeId) return;
    axios
      .get(`http://localhost/smarthr_api/unread_notification_count.php?employee_id=${employeeId}`)
      .then((res) => setUnreadCount(res.data.unread))
      .catch(() => setUnreadCount(0));
  }, [employeeId]);

  // Fetch notifications
  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);
      axios
        .get(`http://localhost/smarthr_api/get_notifications.php?employee_id=${employeeId}`)
        .then((res) => {
          setNotifications(res.data.notifications || []);
          setLoading(false);
        })
        .catch(() => {
          setNotifications([]);
          setLoading(false);
        });
    }
  }, [open, employeeId]);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableScrollLock={true} // Optional
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Notifications
        </Typography>

        {loading ? (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <CircularProgress size={24} />
          </div>
        ) : (
          <List ref={listRef} sx={{ width: 300, maxHeight: 300, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications." />
              </ListItem>
            ) : (
              notifications.map((note, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={note.message} secondary={note.date} />
                </ListItem>
              ))
            )}
          </List>
        )}
      </Popover>
    </>
  );
}
