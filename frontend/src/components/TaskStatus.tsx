import React from 'react';
import { Box, Chip, Button, Stack } from '@mui/material';
import type { Task } from '../types/Task';

interface TaskStatusProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskStatus: React.FC<TaskStatusProps> = ({ task, onStatusChange }) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      'todo': {
        color: '#ff9800',
        backgroundColor: '#fff3e0',
        label: 'To Do',
        icon: '📋'
      },
      'in-progress': {
        color: '#2196f3',
        backgroundColor: '#e3f2fd',
        label: 'In Progress',
        icon: '🔄'
      },
      'done': {
        color: '#4caf50',
        backgroundColor: '#e8f5e9',
        label: 'Done',
        icon: '✅'
      }
    };
    return configs[status as keyof typeof configs] || configs['todo'];
  };

  const getAvailableTransitions = (currentStatus: string) => {
    const transitions = {
      'todo': ['in-progress'],
      'in-progress': ['todo', 'done'],
      'done': ['in-progress']
    };
    return transitions[currentStatus as keyof typeof transitions] || [];
  };

  const currentConfig = getStatusConfig(task.status);
  const availableTransitions = getAvailableTransitions(task.status);

  return (
    <Box>
      <Stack spacing={0.5}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Chip
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                <span>{currentConfig.icon}</span>
                <span style={{ fontSize: '0.75rem' }}>{currentConfig.label}</span>
              </Box>
            }
            sx={{
              backgroundColor: currentConfig.backgroundColor,
              color: currentConfig.color,
              fontWeight: 'bold',
              height: '22px',
              '& .MuiChip-label': {
                display: 'flex',
                alignItems: 'center',
                px: 0.75,
              }
            }}
            size="small"
          />
        </Box>
        
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {availableTransitions.map((newStatus) => {
            const newConfig = getStatusConfig(newStatus);
            return (
              <Button
                key={newStatus}
                variant="outlined"
                size="small"
                onClick={() => onStatusChange(task._id, newStatus)}
                sx={{
                  borderColor: newConfig.color,
                  color: newConfig.color,
                  fontSize: '0.75rem',
                  py: 0,
                  px: 0.5,
                  minWidth: 0,
                  height: '22px',
                  '&:hover': {
                    borderColor: newConfig.color,
                    backgroundColor: newConfig.backgroundColor,
                  }
                }}
              >
                {newConfig.icon}
              </Button>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
};

export default TaskStatus; 