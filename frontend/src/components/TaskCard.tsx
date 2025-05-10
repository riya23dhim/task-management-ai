import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  CardActions,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import type { Task } from '../types/Task';
import TaskStatus from './TaskStatus';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onGenerateSummary: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onEdit,
  onStatusChange,
  onGenerateSummary
}) => {
  const getPriorityConfig = (priority: string) => {
    const configs = {
      'low': {
        color: 'success',
        icon: '🟢'
      },
      'medium': {
        color: 'warning',
        icon: '🟡'
      },
      'high': {
        color: 'error',
        icon: '🔴'
      }
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent sx={{ pb: 0.5, pt: 1, px: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 'bold', wordBreak: 'break-word', lineHeight: 1.2 }}>
            {task.title}
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onEdit(task)}
              sx={{ p: 0.25 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(task._id)}
              color="error"
              sx={{ p: 0.25 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.5em',
            fontSize: '0.8rem',
            lineHeight: 1.3
          }}
        >
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                <span>{priorityConfig.icon}</span>
                <span style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>{task.priority}</span>
              </Box>
            }
            color={priorityConfig.color as any}
            size="small"
            sx={{
              height: '20px',
              '& .MuiChip-label': {
                display: 'flex',
                alignItems: 'center',
                px: 0.5,
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Due: {format(new Date(task.dueDate), 'MMM d')}
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ px: 1.5, pb: 1 }}>
        <TaskStatus task={task} onStatusChange={onStatusChange} />
      </Box>
      
      <CardActions sx={{ p: 1, pt: 0, justifyContent: 'flex-end' }}>
        <Button
          size="small"
          onClick={() => onGenerateSummary(task._id)}
          disabled={!!task.summary}
          sx={{ fontSize: '0.7rem', py: 0.25, minWidth: 0 }}
        >
          {task.summary ? 'Summary Generated' : 'Generate Summary'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard; 